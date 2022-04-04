import React, { RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { NextFitShelf } from '../../../algorithms/strip/online/NextFitShelf';

import { ColorRect } from '../../../types/ColorRect.interface';
import { RectangleExPos } from '../../../types/RectangleExPos.type';
import { OnlineStripPackingAlgorithmEnum } from '../../../types/enums/OnlineStripPackingAlgorithm.enum';
import { OnlineStripPacking } from '../../../types/OnlineStripPackingAlgorithm.interface';
import useScoreStore from '../../../store/score.store';
import { FirstFitShelf } from '../../../algorithms/strip/online/FirstFitShelf';

interface OnlineStripPackingAlgorithmProps {
  gameHeight: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  algorithm: OnlineStripPackingAlgorithmEnum;
  scrollableHeight: number;
  x: number;
  r: number;
}

export interface OnlineStripPackingAlgorithmHandle {
  place: (r: RectangleExPos) => void;
  reset(ctx: { r: number }): void;
}

const OnlineStripPackingAlgorithm = React.forwardRef<OnlineStripPackingAlgorithmHandle, OnlineStripPackingAlgorithmProps>(
  ({ gameHeight, layerRef, width, scrollableHeight, algorithm: selectedAlgorithm, x }, ref) => {
    const [algorithm, setAlgorithm] = useState<OnlineStripPacking>(new NextFitShelf({ height: gameHeight, width }, 0.8));
    const [items, setItems] = useState<ColorRect[]>([]);
    const scoreHeight = useRef(0);
    const setScore = useScoreStore(useCallback(state => state.setScore, []));

    const reset = ({ r }: { r: number }) => {
      setItems([]);
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

    useImperativeHandle(ref, () => ({
      place(r) {
        const placement = algorithm.place(r) as ColorRect; //TODO maybe fix?;

        setItems(old => [...old, placement]);

        const y = Math.round(placement.y * -1);
        if (y > scoreHeight.current) {
          scoreHeight.current = y;
          setScore({ height: y }, 'algorithm');
        }
      },
      reset,
    }));

    return (
      <Layer x={x} y={-(scrollableHeight - gameHeight)} ref={layerRef}>
        {items.map(r => (
          <Rect {...r} y={r.y + scrollableHeight} key={r.name} />
        ))}
      </Layer>
    );
  }
);

export default OnlineStripPackingAlgorithm;
