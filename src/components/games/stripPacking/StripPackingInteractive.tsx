import React, {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Layer, Rect } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { RECT_OVERLAP_COLOR, SNAPPING_THRESHOLD, STRIP_SIZE, STROKE_WIDTH } from '../../../config/canvasConfig';
import { IRect, Vector2d } from 'konva/lib/types';
import useScoreStore from '../../../store/score';
import { Group } from 'konva/lib/Group';
import { Coordinate } from '../../../types/Coordinate.interface';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Rectangle } from '../../../types/Rectangle.interface';
interface StripPackingInteractiveProps {
  height: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  scrollableHeight: number;
}

export interface StripPackingInteractiveHandle {
  place: (r: ColorRect, pos: Vector2d) => void;
  reset: () => void;
}

const StripPackingInteractive = React.forwardRef<
  StripPackingInteractiveHandle,
  StripPackingInteractiveProps
>(({ layerRef, height, scrollableHeight, width }, ref) => {
  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const setScore = useScoreStore(useCallback(state => state.setScore, []));

  useEffect(() => {
    const _height = stripRects.reduce(
      (maxY, r) => Math.max(maxY, Math.round(height - r.y)),
      0
    );
    setScore({ height: _height }, 'user');
  }, [stripRects, height]);

  useImperativeHandle(ref, () => ({
    place: (r, { x, y }) => {
      const newRect = {
        ...r,
        x,
        y,
      };

      setStripRects(old => [...old, newRect]);
    },
    reset: () => {
      setStripRects([]);
      setScore({ height: 0 }, 'user');
    },
  }));

  let lastPos: Coordinate;

  const handleStripDragStart = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.getAttrs(); 
    lastPos = {x, y}
  }

  const handleStripDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target as Shape;
    const scrollOffset = layerRef.current?.y()!;
    stripRects.forEach(r => {
      if (r.name == target.getAttr("name"))
        return;
      
      var _r = layerRef.current?.children?.find(x => x.getAttr("name") == r.name);
      if(_r == undefined)
        return;

      if(intersects(target.getAttrs(), _r.getAttrs()))
        target.setAbsolutePosition({x: lastPos.x, y: lastPos.y + scrollOffset});
      
      target.fill(stripRects.find(r => r.name == target.getAttr("name"))!.fill.substring(0, 7) + "ff")
    });
  }

  // for x axis: p1 is the leftmost x and p2 is the rightmost x of one element. p3 is the leftmost x and p4 is the rightmost x of another element
  // for y axis: p1 is the uppermost y and p2 is the lowermost y of one element. p3 is the uppermost y and p4 is the lowermost y of another element
  const overlapsAxis = (p1: number, p2: number, p3: number, p4: number, threshold = 0) => {
    return p3 >= p1 - threshold && p3 <= p2 + threshold ||
      p4 >= p1 - threshold && p4 <= p2 + threshold ||
      p1 >= p3 - threshold && p1 <= p4 + threshold ||
      p2 >= p3 - threshold && p2 <= p4 + threshold
  };

  //subtract and add one to allow squares' edges to be overlapping
  const intersects = (a: Rectangle, b: Rectangle): boolean => {
    return overlapsAxis(a.x, a.x + a.width, b.x + STROKE_WIDTH + 1, b.x + b.width - STROKE_WIDTH - 1) && overlapsAxis(a.y, a.y + a.height, b.y + STROKE_WIDTH + 1, b.y + b.height - STROKE_WIDTH - 1)
  }

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target as Shape;
    target.moveToTop();

    const snap = (rectangles: Group[]) => {
      let intersectsAny = false;
      rectangles.forEach(f => {
        const { name, x, y, height, width } = f.getAttrs();
        let { x: targetX, y: targetY, height: targetHeight, width: targetWidth, name: targetName } = target.getAttrs();
        const stripScrollOffset = layerRef.current?.y()!;
        
        if (name == targetName) return;

        if ((x - SNAPPING_THRESHOLD < targetX + targetWidth && targetX + targetWidth < x + SNAPPING_THRESHOLD && y < targetY + targetHeight && y + height > targetY)) {
          // Snap target's right side to f's left side 
          target.setAbsolutePosition({ x: x - targetWidth, y: targetY + stripScrollOffset });

        } else if (((x + width) - SNAPPING_THRESHOLD < targetX && (x + width) + SNAPPING_THRESHOLD > targetX) && y < targetY + targetHeight && y + height > targetY) {
          // Snap target's left side to f's right side
          target.setAbsolutePosition({ x: x + width, y: targetY + stripScrollOffset });

        } else if (((y + height) - SNAPPING_THRESHOLD < targetY && (y + height) + SNAPPING_THRESHOLD > targetY) && x < targetX + targetWidth && x + width > targetX) {
          // Snap target's top side to f's bottom side
          target.setAbsolutePosition({ x: targetX, y: y + height + stripScrollOffset });

        } else if (((y + SNAPPING_THRESHOLD) > targetY + targetHeight && (y - SNAPPING_THRESHOLD) < targetY + targetHeight) && x < targetX + targetWidth && x + width > targetX) {
          // Snap target's bottom side to f's top side
          target.setAbsolutePosition({ x: targetX, y: y - targetHeight + stripScrollOffset });

        } else if (intersects(f.getAttrs(), target.getAttrs())) {
          intersectsAny = true;
        }
      });
      if (intersectsAny) {
        //overlap while dragging
        target.setAttr("fill", RECT_OVERLAP_COLOR);
      } else {
        //no overlap while dragging
        let color = stripRects.find(r => r.name == e.target.name())?.fill ?? stripRects.find(r => r.name == e.target.name())?.fill;
        target.setAttr("fill", color!.substring(0, 7) + "80");
      }
    };

    snap(layerRef.current?.children as Group[]);
  };

  return (
    <>
      <Layer y={-(scrollableHeight - height)} x={0} ref={layerRef}>
        {stripRects.map((r, i) => {
          return (
            <Rect
              key={r.name}
              {...r}
              draggable
              strokeWidth={STROKE_WIDTH}
              stroke="red"
              y={r.y + height}
              onDragStart={handleStripDragStart}
              onDragEnd={handleStripDragEnd}
              onDragMove={handleDragMove}
              id={`STRIP_RECT`}
            />
          );
        })}
      </Layer>
    </>
  );
});

export default StripPackingInteractive;
