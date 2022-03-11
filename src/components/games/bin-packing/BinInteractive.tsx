import React, { forwardRef, useState } from 'react';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Layer, Rect } from 'react-konva';
import { IRect, Vector2d } from 'konva/lib/types';
import { generateData } from '../../../utils/generateData';
import Konva from 'konva';
import { Dimensions } from '../../../types/Dimensions.interface';
interface BinInteractiveProps {
  offset: Vector2d;
  dimensions: Dimensions;
}
// bin dimensions
const binDim = {
  height: 200,
  width: 300,
};

const BinInteractive = forwardRef<KonvaLayer, BinInteractiveProps>(
  ({ offset, dimensions }, ref) => {
    const padding = 40;
    const [bins] = useState<IRect[]>(() => {
      const b: IRect[] = [];

      for (let i = 0; i < 5; i++) {
        b.push({ ...binDim, x: i * (binDim.width + padding), y: 0 });
      }

      return b;
    });
    console.log(bins);
    return (
      <Layer ref={ref} x={offset.x} y={0}>
        {bins.map((b, i) => {
          return <Rect {...b} key={i} fill={'#eee'} opacity={0.5} />;
        })}
      </Layer>
    );
  }
);

export default BinInteractive;
