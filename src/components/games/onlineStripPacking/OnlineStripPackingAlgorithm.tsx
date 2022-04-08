import React, { RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { KonvaNodeEvents, Layer, Rect } from 'react-konva';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { NextFitShelf } from '../../../algorithms/strip/online/NextFitShelf';
import { ColorRect } from '../../../types/ColorRect.interface';
import { OnlineStripPackingAlgorithmEnum } from '../../../types/enums/OnlineStripPackingAlgorithm.enum';
import { OnlineStripPacking } from '../../../types/OnlineStripPackingAlgorithm.interface';
import useScoreStore from '../../../store/score.store';
import { FirstFitShelf } from '../../../algorithms/strip/online/FirstFitShelf';
import { IRect } from 'konva/lib/types';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import Konva from 'konva';
import { RectConfig } from 'konva/lib/shapes/Rect';
import useLevelStore from '../../../store/level.store';

interface OnlineStripPackingAlgorithmProps {
  gameHeight: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  algorithm: OnlineStripPackingAlgorithmEnum;
  scrollableHeight: number;
  x: number;
  inventoryWidth: number;
  stripRects: ColorRect<RectangleConfig>[];
  r: number;
}
type PrevPos = { prevX: number; prevY: number };
const ENTER_ANIMATION_DURATION_SECONDS = 0.5;

export interface OnlineStripPackingAlgorithmHandle {
  place: (r: IRect) => Promise<void>;
  reset(ctx: { r: number }): void;
}

const OnlineStripPackingAlgorithm = React.forwardRef<OnlineStripPackingAlgorithmHandle, OnlineStripPackingAlgorithmProps>(
  ({ gameHeight, stripRects, layerRef, width, scrollableHeight, algorithm: selectedAlgorithm, x, inventoryWidth }, ref) => {
    const [algorithm, setAlgorithm] = useState<OnlineStripPacking>(new NextFitShelf({ height: gameHeight, width }, 0.8));
    const [items, setItems] = useState<ColorRect<RectangleConfig & PrevPos>[]>([]);
    const scoreHeight = useRef(0);
    const level = useLevelStore(useCallback(state => state.level, []));
    const { averageTimeUsed, usedRectsAreaAlgo, setUsedGameAreaAlgo, setUsedRectsAreaAlgo } = useScoreStore();
    const setScore = useScoreStore(useCallback(state => state.setScore, []));

    const reset = ({ r }: { r: number }) => {
      setItems([]);
      scoreHeight.current = 0;
      switch (selectedAlgorithm) {
        case OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF:
          setAlgorithm(new NextFitShelf({ height: gameHeight, width }, r));
          break;
        case OnlineStripPackingAlgorithmEnum.FIRST_FIT_SHELF:
          setAlgorithm(new FirstFitShelf({ height: gameHeight, width }, r));
          break;

        default:
          throw Error('Unkown algorithm: ' + selectedAlgorithm);
      }
    };

    useEffect(() => {
      setUsedGameAreaAlgo(scoreHeight.current * width);

      if (scoreHeight.current === 0) {
        setScore(0, 'algorithm');
        return;
      }

      setScore({ level, usedRectsArea: usedRectsAreaAlgo!, usedGameArea: scoreHeight.current * width, averageTimeUsed }, 'algorithm');
    }, [stripRects, scoreHeight.current]);

    useImperativeHandle(ref, () => ({
      place(r) {
        return new Promise(res => {
          const placement = algorithm.place(r) as ColorRect;
          const newItem = { ...placement, prevX: r.x - inventoryWidth, prevY: r.y - layerRef.current!.y() };
          setItems(old => [...old, newItem]);
          setUsedRectsAreaAlgo(stripRects.reduce((prev, curr) => curr.height * curr.width + prev, newItem.height * newItem.width));

          const y = Math.round(placement.y * -1);
          if (y > scoreHeight.current) {
            scoreHeight.current = y;
            setUsedGameAreaAlgo(y * width);
          }

          setTimeout(res, ENTER_ANIMATION_DURATION_SECONDS * 1000);
        });
      },
      reset,
    }));

    return (
      <Layer x={x} y={-(scrollableHeight - gameHeight)} ref={layerRef}>
        {items.map(r => (
          <MyRect {...r} y={r.y + scrollableHeight} key={r.name} />
        ))}
      </Layer>
    );
  }
);

export default OnlineStripPackingAlgorithm;

const MyRect: React.FC<PrevPos & RectConfig & KonvaNodeEvents> = ({ x, y, prevX, prevY, ...props }) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    new Konva.Tween({
      node: ref.current!,
      duration: ENTER_ANIMATION_DURATION_SECONDS,
      x,
      y,
      easing: Konva.Easings.StrongEaseInOut,
    }).play();
  }, [x, y]);

  return <Rect ref={ref} x={prevX} y={prevY} stroke={'rgba(0,0,0,0.2)'} strokeWidth={1} {...props}></Rect>;
};
