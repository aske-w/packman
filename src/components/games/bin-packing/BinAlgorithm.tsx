import Konva from 'konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { IRect, Vector2d } from 'konva/lib/types';
import { forwardRef, Fragment, RefObject, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import { KonvaNodeEvents, Layer, Rect, Text } from 'react-konva';
import FiniteFirstFit from '../../../algorithms/bin/offline/FiniteFirstFit';
import FiniteNextFit from '../../../algorithms/bin/offline/FiniteNextFit';
import HybridFirstFit from '../../../algorithms/bin/offline/HybridFirstFit';
import { BinPackingAlgorithm } from '../../../types/enums/BinPackingAlgorithm.enum';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { BinPackingAlgoRect, PlacedBinPackingAlgoRect, PrevPos } from '../../../types/BinPackingRect.interface';
import useScoreStore from '../../../store/score.store';
import useLevelStore from '../../../store/level.store';
import { BIN_PADDING, calcBinLayout } from '../../../utils/binPacking';
interface BinAlgorithmProps {
  offset: Vector2d;
  dimensions: Dimensions;
  binSize: Dimensions;
  selectedAlgorithm: BinPackingAlgorithm;
  data: DimensionsWithConfig[];
  layerRef: RefObject<KonvaLayer>;
  staticInventory: ColorRect[];
  getInventoryScrollOffset: () => number;
}

export interface BinAlgorithmHandle {
  next(): [ColorRect<BinPackingAlgoRect>, number, number] | undefined;
  place: (inventoryRect: ColorRect<BinPackingAlgoRect>, idx: number) => void;
  reset(): void;
}

const { FINITE_FIRST_FIT, FINITE_NEXT_FIT, HYBRID_FIRST_FIT } = BinPackingAlgorithm;
const BinAlgorithm = forwardRef<BinAlgorithmHandle, BinAlgorithmProps>(
  ({ offset, layerRef, dimensions, data, selectedAlgorithm, binSize, staticInventory: inventory, getInventoryScrollOffset }, ref) => {
    const [bins, setBins] = useState<Record<string, PlacedBinPackingAlgoRect[]>>({});
    const [binLayout, setBinLayout] = useState<IRect[]>([]);
    const [order, setOrder] = useState(0);
    const numBins = Object.values(bins).length;

    const setBinScore = useScoreStore(useCallback(state => state.setBinScore, []));
    const level = useLevelStore(useCallback(state => state.level, []));

    useImperativeHandle(ref, () => ({
      reset: () => {
        setOrder(0);
        setBins({});
      },
      next: () => {
        if (algorithm.current?.isFinished()) return;
        const rect = algorithm.current?.place();
        if (!rect) return;

        const idx = inventory.findIndex(r => r.name === rect.name)!;

        return [rect, order, idx];
      },
      place: (rect: ColorRect<BinPackingAlgoRect>, invIdx: number) => {
        const inventoryRect = inventory[invIdx]!;
        // remove the scroll offset from y value
        const scrollOffset = getInventoryScrollOffset();

        const newRect: PlacedBinPackingAlgoRect = {
          ...rect,
          prevX: inventoryRect.x - offset.x, // substract the inventory width (its relative to the strip)
          prevY: inventoryRect.y - scrollOffset - offset.y,
        };

        setBins(prevBins => {
          const bins = binLayout.reduce((acc, _, i) => {
            if (newRect.binId === i) {
              return { ...acc, [i]: (prevBins?.[i] ?? []).concat(newRect) };
            }

            return acc;
          }, prevBins);

          return bins;
        });
        setOrder(old => old + 1);
      },
    }));

    const algorithm = useRef<PackingAlgorithm<{}, BinPackingAlgoRect>>();
    const start = (data: DimensionsWithConfig[]) => {
      switch (selectedAlgorithm) {
        case FINITE_NEXT_FIT:
          algorithm.current = new FiniteNextFit(binSize).load(data);
          break;

        case FINITE_FIRST_FIT:
          algorithm.current = new FiniteFirstFit(binSize).load(data);
          break;

        case HYBRID_FIRST_FIT:
          algorithm.current = new HybridFirstFit(binSize).load(data);
          break;

        default:
          console.error('unkown algorithm:', selectedAlgorithm);
          break;
      }
    };

    const [prevInventory, setPrevInventory] = useState('');

    useEffect(() => {
      const newInv = JSON.stringify(inventory.map(({ name }) => name).sort());
      // only reset if the names (ids) changes
      if (prevInventory === newInv) return;
      setPrevInventory(newInv);
      start([...data]);
    }, [selectedAlgorithm, data]);

    useEffect(() => {
      const numBins = Object.keys(bins).length;
      const rowHeight = binSize.height + BIN_PADDING;
      const binsPrRow = Math.floor(dimensions.width / (binSize.width + BIN_PADDING));
      // const isNewBin = bins[newRect.binId] === undefined;
      const binLayouts = calcBinLayout(numBins, binsPrRow, binSize, rowHeight);
      setBinLayout(binLayouts);
    }, [numBins]);

    useEffect(() => {
      setBinScore(
        {
          binLayouts: binLayout,
          bins,
          level,
        },
        'algorithm'
      );
    }, [bins, binLayout, level]);

    return (
      <Layer y={offset.y} x={offset.x} ref={layerRef}>
        {binLayout.map((b, i) => {
          const binRects = bins[i];

          return (
            <Fragment key={i}>
              <Rect {...b} fill={'#eee'} opacity={0.5} />
              <Text text={i.toString()} x={b.x} y={b.y - 24} fontSize={24} />
              {binRects?.map(r => (
                <MyRect {...r} x={r.x + b.x} y={r.y + b.y + b.height} key={r.name} />
              ))}
            </Fragment>
          );
        })}
      </Layer>
    );
  }
);

export default BinAlgorithm;

const ENTER_ANIMATION_DURATION_SECONDS = 0.5;

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
