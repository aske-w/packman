import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { IRect, Vector2d } from 'konva/lib/types';
import { forwardRef, Fragment, useEffect, useMemo, useState } from 'react';
import { Group, Layer, Rect, Text } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
interface BinInteractiveProps {
  offset: Vector2d;
  dimensions: Dimensions;
  bins: Record<number, ColorRect[]>;
  binSize: Dimensions;
  onBinLayout: (bins: IRect[]) => void;
}

const PADDING = 30;

const BinInteractive = forwardRef<KonvaLayer, BinInteractiveProps>(({ offset, dimensions, bins, onBinLayout, binSize: binDim }, ref) => {
  const rowHeight = binDim.height + PADDING;
  const binsPrRow = Math.floor(dimensions.width / (binDim.width + PADDING));
  const numBins = Object.values(bins).length;
  const calcBinLayout = () => {
    let x = 0;
    const b: IRect[] = [];

    for (let i = 0; i < numBins + 1; i++) {
      x = (i % binsPrRow) * (binDim.width + PADDING) + PADDING;
      let rowNum = Math.floor(i / binsPrRow);

      b.push({
        ...binDim,
        x,
        y: rowNum * rowHeight + PADDING,
      });
    }
    onBinLayout(b);
    return b;
  };
  const [renderedBins, setRenderedBins] = useState(calcBinLayout);
  useEffect(() => {
    setRenderedBins(calcBinLayout);
  }, [numBins]);

  return (
    <Layer ref={ref} x={offset.x} y={0}>
      {renderedBins.map((b, i) => {
        return (
          <Fragment key={i + '_text'}>
            <Rect {...b} fill={'#eee'} opacity={0.5} />
            <Text text={i.toString()} x={b.x} y={b.y} fontSize={24} />
            {bins[i]?.map(r => (
              <Rect {...r} key={r.name} draggable x={r.x - offset.x} />
            ))}
          </Fragment>
        );
      })}
    </Layer>
  );
});

export default BinInteractive;
