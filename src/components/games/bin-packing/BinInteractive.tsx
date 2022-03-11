import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { IRect, Vector2d } from 'konva/lib/types';
import { forwardRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { Dimensions } from '../../../types/Dimensions.interface';
interface BinInteractiveProps {
  offset: Vector2d;
  dimensions: Dimensions;
}
// bin dimensions
const binDim = {
  height: 300,
  width: 400,
};
const PADDING = 30;
const NUM_ROWS = 2;
const BinInteractive = forwardRef<KonvaLayer, BinInteractiveProps>(
  ({ offset, dimensions }, ref) => {
    const [bins] = useState<IRect[]>(() => {
      const b: IRect[] = [];
      const rowHeight = binDim.height + PADDING;
      const binsPrRow = Math.floor(dimensions.width / (binDim.width + PADDING));
      for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < binsPrRow; col++) {
          console.log(col, row);
          const x = col * (binDim.width + PADDING) + PADDING;

          b.push({
            ...binDim,
            x,
            y: row * rowHeight + PADDING,
          });
        }
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
