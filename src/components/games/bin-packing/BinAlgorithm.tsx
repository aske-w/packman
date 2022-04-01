import Konva from 'konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';

import { IRect, Vector2d } from 'konva/lib/types';
import { forwardRef, Fragment, RefObject, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';

import { Group, KonvaNodeEvents, Layer, Rect, Text } from 'react-konva';
import FiniteFirstFit from '../../../algorithms/bin/offline/FiniteFirstFit';
import FiniteNextFit from '../../../algorithms/bin/offline/FiniteNextFit';
import HybridFirstFit from '../../../algorithms/bin/offline/HybridFirstFit';
import algorithm from '../../../store/algorithm.store';
import { BinPackingAlgorithms } from '../../../types/BinPackingAlgorithm.interface';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
interface BinAlgorithmProps {
  offset: Vector2d;
  dimensions: Dimensions;
  binSize: Dimensions;
  selectedAlgorithm: BinPackingAlgorithms;
  data: DimensionsWithConfig[];
  binLayout: IRect[];
  layerRef: RefObject<KonvaLayer>;
  staticInventory: ColorRect[];
  getInventoryScrollOffset: () => number;
}

type PrevPos = { prevX: number; prevY: number };

export interface BinAlgorithmHandle {
  place: () => void;
}

const PADDING = 30;
const { FINITE_FIRST_FIT, FINITE_NEXT_FIT, HYBRID_FIRST_FIT } = BinPackingAlgorithms;
const BinAlgorithm = forwardRef<BinAlgorithmHandle, BinAlgorithmProps>(
  ({ offset, layerRef, dimensions, data, selectedAlgorithm, binSize, binLayout, staticInventory: inventory, getInventoryScrollOffset }, ref) => {
    const [placed, setPlaced] = useState<
      ColorRect<
        RectangleConfig & {
          binId: number;
        } & PrevPos
      >[]
    >([]);

    useImperativeHandle(ref, () => ({
      place: () => {
        if (algorithm.current?.isFinished()) return;
        const rect = algorithm.current?.place();
        if (!rect) return;
        const inventoryRect = inventory.find(r => r.name === rect.name)!;

        // remove the scroll offset from y value
        const scrollOffset = getInventoryScrollOffset();

        const newRect = {
          ...rect,
          prevX: inventoryRect.x - offset.x, // substract the inventory width (its relative to the strip)
          prevY: inventoryRect.y - scrollOffset - offset.y,
        };
        setPlaced(p => p.concat(newRect));
      },
    }));

    const algorithm = useRef<PackingAlgorithm<{}, RectangleConfig & { binId: number }>>();
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
    useEffect(() => {
      start([...data]);
    }, [selectedAlgorithm]);

    return (
      <Layer y={offset.y} x={offset.x} ref={layerRef}>
        {binLayout.map((b, i) => {
          const binRects = placed.filter(({ binId }) => binId === i);

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
