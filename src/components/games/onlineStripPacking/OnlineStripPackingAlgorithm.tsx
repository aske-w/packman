import React, { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { NextFitShelf } from '../../../algorithms/strip/online/NextFitShelf';

import { ColorRect } from '../../../types/ColorRect.interface';
import { RectangleExPos } from '../../../types/RectangleExPos.type';
import { first } from 'lodash';
import { OnlineStripPackingAlgorithmEnum } from '../../../types/enums/OnlineStripPackingAlgorithm.enum';
import { OnlineStripPacking } from '../../../types/OnlineStripPackingAlgorithm.interface';

interface OnlineStripPackingAlgorithmProps {
  gameHeight: number;
  width: number;
  layerRef: RefObject<KonvaLayer>;
  algorithm: OnlineStripPackingAlgorithmEnum;
  scrollableHeight: number;
  x: number;
}

export interface OnlineStripPackingAlgorithmHandle {
  place: (r: RectangleExPos) => void;
}

const OnlineStripPackingAlgorithm = React.forwardRef<OnlineStripPackingAlgorithmHandle, OnlineStripPackingAlgorithmProps>(
  ({ gameHeight, layerRef, width, scrollableHeight, algorithm: selectedAlgorithm, x }, ref) => {
    useImperativeHandle(ref, () => ({
      place(r) {
        const placement = algorithm.place(r) as ColorRect; //TODO maybe fix?;

        setItems(old => [...old, placement]);
      },
    }));

    const [algorithm, setAlgorithm] = useState<OnlineStripPacking>(new NextFitShelf({ height: gameHeight, width }, 0.8));
    const [items, setItems] = useState<ColorRect[]>([]);

    useEffect(() => {
      switch (selectedAlgorithm) {
        case OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF:
          setAlgorithm(new NextFitShelf({ height: gameHeight, width }, 0.5));
          break;

        default:
          throw Error('Unkown algorithm: ' + selectedAlgorithm);
      }
    }, [selectedAlgorithm]);

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
