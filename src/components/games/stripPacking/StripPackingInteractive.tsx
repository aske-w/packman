import produce from 'immer';
import { Group } from 'konva/lib/Group';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Vector2d } from 'konva/lib/types';
import React, { RefObject, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { STROKE_WIDTH } from '../../../config/canvasConfig';
import useLevelStore from '../../../store/level.store';
import useScoreStore from '../../../store/score.store';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Coordinate } from '../../../types/Coordinate.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { intersects } from '../../../utils/intersects';
import { calculateScore } from '../../../utils/utils';
interface StripPackingInteractiveProps {
  height: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  scrollableHeight: number;
  stripRects: ColorRect<RectangleConfig>[];
  setStripRects: React.Dispatch<React.SetStateAction<ColorRect<RectangleConfig>[]>>;
  snap: (destination: Group[], target: Shape) => void;
  stripRectChangedCallback: () => void;
  staticInvLength: number;
}

export interface StripPackingInteractiveHandle {
  place: (r: ColorRect, pos: Vector2d) => void;
  reset: () => void;
}

const StripPackingInteractive = React.forwardRef<StripPackingInteractiveHandle, StripPackingInteractiveProps>(
  ({ layerRef, width, height, scrollableHeight, stripRects, setStripRects, snap, stripRectChangedCallback, staticInvLength }, ref) => {
    const setScore = useScoreStore(useCallback(state => state.setScore, []));

    const { level } = useLevelStore();
    const { user, algorithm: algoScore, setUsedGameAreaUser, setUsedRectsAreaUser, averageTimeUsed, usedRectsAreaUser } = useScoreStore();
    const permission = useLevelStore(useCallback(state => state.getPermission(), []));

    useEffect(() => {
      const _height = stripRects.reduce((maxY, r) => Math.max(maxY, Math.round(Math.abs(scrollableHeight - r.y) - height)), 0);
      setUsedGameAreaUser(_height * width);
      if (_height === 0) {
        setScore({ height: 0 }, 'algorithm');
        return;
      }
      const score = calculateScore(level, usedRectsAreaUser!, _height * width, averageTimeUsed);
      setScore({ height: Math.round(score) }, 'user');
    }, [stripRects, height]);

    useImperativeHandle(ref, () => ({
      place: (r, { x, y }) => {
        const newRect = {
          ...r,
          x,
          y,
        };
        setUsedRectsAreaUser(stripRects.reduce((prev, curr) => curr.height * curr.width + prev, newRect.height * newRect.width));
        setStripRects(old => [...old, newRect]);
      },
      reset: () => {
        setStripRects([]);
      },
    }));

    const [lastPos, setLastPos] = useState<Coordinate | null>(null);

    const handleStripDragStart = (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = e.target.getAttrs();
      setLastPos({ x, y });
    };

    const handleStripDragEnd = (e: KonvaEventObject<DragEvent>) => {
      const target = e.target as Shape;
      const scrollOffset = layerRef.current?.y()!;
      stripRects.forEach(r => {
        if (r.name == target.getAttr('name')) return;

        var _r = layerRef.current?.children?.find(x => x.getAttr('name') == r.name);
        if (_r == undefined) return;

        if (intersects(target.getAttrs(), _r.getAttrs()) && lastPos)
          target.setAbsolutePosition({
            x: lastPos.x,
            y: lastPos.y + scrollOffset,
          });
      });
      target.fill(stripRects.find(r => r.name == target.getAttr('name'))!.fill.substring(0, 7) + 'ff');

      setStripRects(
        produce(draft => {
          const pos = e.target.getAbsolutePosition();
          const idx = draft.findIndex(sr => sr.name === target.name());
          const y = pos.y - height - layerRef.current!.y();
          draft[idx].x = pos.x;
          draft[idx].y = y;
        })
      );
    };

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const target = e.target as Shape;
      target.moveToTop();
      snap(layerRef.current?.children as Group[], target);
    };

    return (
      <>
        <Layer y={-(scrollableHeight - height)} x={0} ref={layerRef}>
          {stripRects.map((r, i) => {
            return (
              <Rect
                key={r.name}
                {...r}
                draggable={permission.allowDrag}
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
  }
);

export default StripPackingInteractive;
