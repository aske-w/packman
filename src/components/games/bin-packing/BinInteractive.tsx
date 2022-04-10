import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Shape } from 'konva/lib/Shape';
import { IRect, Vector2d } from 'konva/lib/types';
import { forwardRef, Fragment, useCallback, useEffect, useState } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { Group } from 'konva/lib/Group';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { Group as GroupType } from 'konva/lib/Group';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCombinedRefs } from '../../../hooks/useCombinedRefs';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { intersects } from '../../../utils/intersects';
import produce from 'immer';
import { Coordinate } from '../../../types/Coordinate.interface';
import { Bin } from '../../../types/Bin.interface';
import { findBin } from '../../../utils/binPacking';
import useScoreStore from '../../../store/score.store';
import useLevelStore from '../../../store/level.store';

interface BinInteractiveProps {
  offset: Vector2d;
  dimensions: Dimensions;
  bins: Bin;
  binSize: Dimensions;
  onBinLayout: (bins: IRect[]) => void;
  setBins: React.Dispatch<React.SetStateAction<Record<number, ColorRect<RectangleConfig>[]>>>;
  snap: (destination: GroupType[], target: Shape) => void;
}

const PADDING = 30;

const BinInteractive = forwardRef<KonvaLayer, BinInteractiveProps>(
  ({ setBins, offset, dimensions, bins, onBinLayout, snap, binSize: binDim }, ref) => {
    const setBinScore = useScoreStore(useCallback(state => state.setBinScore, []));
    const level = useLevelStore(useCallback(state => state.level, []));
    const rowHeight = binDim.height + PADDING;
    const binsPrRow = Math.floor(dimensions.width / (binDim.width + PADDING));
    const numBins = Object.values(bins).length;
    const layerRef = useCombinedRefs(ref);

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

    useEffect(() => {
      setBinScore({ binLayouts: renderedBins, bins, level }, 'user');
    }, [renderedBins, bins, level]);

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const target = e.target as Shape;
      target.moveToTop();
      snap(layerRef.current?.children as Group[], target);
    };

    const [lastPos, setLastPos] = useState<Coordinate | null>(null);

    const handleStripDragStart = (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = e.target.getAttrs();
      setLastPos({ x, y });
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
      const target = e.target as Shape;
      const scrollOffset = layerRef.current?.y()!;

      // Check if is placing outside a bin
      const { x, y } = target.getAbsolutePosition();
      const dropPos = {
        y: -scrollOffset + y,
        x: x - offset.x,
      };
      if (findBin(renderedBins, dropPos, target.getAttrs()) === -1 && lastPos) {
        target.setAbsolutePosition({
          x: lastPos.x + offset.x,
          y: lastPos.y + scrollOffset,
        });
        return;
      }

      Object.keys(bins).forEach((binId, i) => {
        bins[binId].forEach(r => {
          if (r.name == target.getAttr('name')) return;

          var _r = layerRef.current?.children?.find(x => x.getAttr('name') == r.name);
          if (_r == undefined) return;

          if (intersects(target.getAttrs(), _r.getAttrs()) && lastPos)
            target.setAbsolutePosition({
              x: lastPos.x + offset.x,
              y: lastPos.y + scrollOffset,
            });
        });

        const { rectIdx, binIdx } = Object.keys(bins).reduce(
          (acc, binIdx) => {
            const bin = bins[binIdx] as ColorRect[];
            if (acc.binIdx !== -1 || acc.rectIdx !== -1) return acc;

            const rectIdx = bin.findIndex(r => r.name == target.getAttr('name'));

            if (rectIdx !== -1) {
              return { binIdx: parseInt(binIdx), rectIdx };
            }

            return acc;
          },
          { binIdx: -1, rectIdx: -1 }
        );

        target.fill(bins[binIdx]?.[rectIdx]?.fill.substring(0, 7) + 'ff');

        setBins(
          produce(bin => {
            const pos = e.target.getAbsolutePosition();
            const y = pos.y - layerRef.current!.y();
            bin[binIdx][rectIdx].x = pos.x;
            bin[binIdx][rectIdx].y = y;
          })
        );
      });
    };

    return (
      <Layer ref={layerRef} x={offset.x} y={0}>
        {renderedBins.map((b, i) => {
          return (
            <Fragment key={i + '_text'}>
              {/* BIN */}
              <Rect {...b} fill={'#eee'} opacity={0.5} id={`bin_${i}`} />
              {/* Top border */}
              <Rect {...{ ...b, y: b.y - 1, height: 1 }} fill="transparent" stroke="transparent" strokeWidth={1} id={`border_top${i}`} />
              {/* Left border */}
              <Rect {...{ ...b, x: b.x - 1, width: 1 }} fill="transparent" stroke="transparent" strokeWidth={1} id={`border_left${i}`} />
              {/* Bottom border */}
              <Rect {...{ ...b, y: b.y + b.height, height: 1 }} fill="transparent" stroke="transparent" strokeWidth={1} id={`border_bottom${i}`} />
              {/* Right border */}
              <Rect {...{ ...b, x: b.x + b.width, width: 1 }} fill="transparent" stroke="transparent" strokeWidth={1} id={`border_right${i}`} />
              <Text text={i.toString()} x={b.x} y={b.y - 24} fontSize={24} />
              {bins[i]?.map(r => (
                <Rect
                  onDragStart={handleStripDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  {...r}
                  key={r.name}
                  draggable
                  x={r.x - offset.x}
                />
              ))}
            </Fragment>
          );
        })}
      </Layer>
    );
  }
);

export default BinInteractive;
