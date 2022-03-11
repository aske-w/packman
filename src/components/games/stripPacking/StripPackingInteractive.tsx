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
import { GAME_WIDTH, RECT_OVERLAP_COLOR, SNAPPING_THRESHOLD, STRIP_SIZE, STROKE_WIDTH } from '../../../config/canvasConfig';
import { IRect, Vector2d } from 'konva/lib/types';
import useScoreStore from '../../../store/score';
import { Group } from 'konva/lib/Group';
import { Coordinate } from '../../../types/Coordinate.interface';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Rectangle } from '../../../types/Rectangle.interface';
import { intersects } from '../../../utils/intersects';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { clamp } from '../../../utils/clamp';
interface StripPackingInteractiveProps {
  height: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  scrollableHeight: number;
  stripRects: ColorRect<RectangleConfig>[];
  setStripRects: React.Dispatch<React.SetStateAction<ColorRect<RectangleConfig>[]>>;
  snap: (destination: Group[], target: Shape)=> void;
}

export interface StripPackingInteractiveHandle {
  place: (r: ColorRect, pos: Vector2d) => void;
  reset: () => void;
}

const StripPackingInteractive = React.forwardRef<
  StripPackingInteractiveHandle,
  StripPackingInteractiveProps
>(({ layerRef, height, scrollableHeight, stripRects, setStripRects, snap }, ref) => {
  // const [stripRects, setStripRects] = useState<ColorRect[]>([]);
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
      
      });
    target.fill(stripRects.find(r => r.name == target.getAttr("name"))!.fill.substring(0, 7) + "ff")
  }



  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target as Shape;
    target.moveToTop();
    // console.log(layerRef.current?.children);
    snap(layerRef.current?.children as Group[], target);
    var x = clamp(target.getAttr("x"), 0, GAME_WIDTH);
    target.setAttr("x", x);
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
