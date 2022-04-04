import React, { RefObject, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { STROKE_WIDTH } from '../../../config/canvasConfig';
import { Vector2d } from 'konva/lib/types';
import useScoreStore from '../../../store/score.store';
import { Group } from 'konva/lib/Group';
import { Coordinate } from '../../../types/Coordinate.interface';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { intersects } from '../../../utils/intersects';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import useLevelStore from '../../../store/level.store';
import { useEvents } from '../../../hooks/useEvents';
import useAlgorithmStore from '../../../store/algorithm.store';
import produce from 'immer';
interface OnlineStripPackingInteractiveProps {
  height: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  scrollableHeight: number;
  stripRects: ColorRect<RectangleConfig>[];
  setStripRects: React.Dispatch<React.SetStateAction<ColorRect<RectangleConfig>[]>>;
  snap: (destination: Group[], target: Shape) => void;
  stripRectChangedCallback?(): void;
  staticInvLength: number;
}

export interface OnlineStripPackingInteractiveHandle {
  place: (r: ColorRect, pos: Vector2d) => void;
  reset: () => void;
}

const OnlineStripPackingInteractive = React.forwardRef<OnlineStripPackingInteractiveHandle, OnlineStripPackingInteractiveProps>(
  ({ layerRef, height, scrollableHeight, stripRects, setStripRects, snap, stripRectChangedCallback, staticInvLength }, ref) => {
    const setScore = useScoreStore(useCallback(state => state.setScore, []));
    const algorithm = useAlgorithmStore(useCallback(({ algorithm }) => algorithm, []));
    const [userScoreChanged, setUserScoreChanged] = useState(false);
    const [algoScoreChanged, setAlgoScoreChanged] = useState(false);

    const { onPlaceEvent } = useEvents(algorithm);

    const { user, algorithm: algoScore } = useScoreStore();
    const permission = useLevelStore(useCallback(state => state.getPermission(), []));

    useEffect(() => {
      const _height = stripRects.reduce((maxY, r) => Math.max(maxY, Math.round(Math.abs(scrollableHeight - r.y) - height)), 0);
      setScore({ height: _height }, 'user');
    }, [stripRects, height]);

    // useEffect(() => {
    //   setUserScoreChanged(user.height != 0);
    // }, [user]);
    // useEffect(() => {
    //   setAlgoScoreChanged(algoScore.height != 0);
    // }, [algoScore]);

    useEffect(() => onPlaceEvent(stripRects.length, staticInvLength), [stripRects.length, staticInvLength]);

    // useEffect(() => {
    //   if (userScoreChanged && algoScoreChanged) {
    //     onPlaceEvent(stripRects.length, staticInvLength);
    //     setUserScoreChanged(false);
    //     setAlgoScoreChanged(false);
    //   }
    // }, [userScoreChanged, algoScoreChanged]);

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

        const _r = layerRef.current?.children?.find(x => x.getAttr('name') == r.name);
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

export default OnlineStripPackingInteractive;
