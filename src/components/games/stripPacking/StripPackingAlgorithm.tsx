import Konva from 'konva';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { KonvaNodeEvents, Layer, Rect } from 'react-konva';
import { BestFitDecreasingHeight } from '../../../algorithms/BestFitDecreasingHeight';
import { FirstFitDecreasingHeight } from '../../../algorithms/FirstFitDecreasingHeight';
import { NextFitDecreasingHeight } from '../../../algorithms/NextFitDecreasingHeight';
import { SizeAlternatingStack } from '../../../algorithms/SizeAlternatingStack';
import useScoreStore from '../../../store/score';
import { ColorRect } from '../../../types/ColorRect.interface';
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';

const {
  BEST_FIT_DECREASING_HEIGHT,
  NEXT_FIT_DECREASING_HEIGHT,
  FIRST_FIT_DECREASING_HEIGHT,
  SIZE_ALTERNATING_STACK,
} = PackingAlgorithms;

type PrevPos = { prevX: number; prevY: number };

interface StripPackingAlgorithmProps {
  x: number;
  height: number;
  width: number;
  algorithm: PackingAlgorithms;
  inventory: ReadonlyArray<ColorRect<RectangleConfig>>;
  inventoryWidth: number;
  inventoryScrollOffset: RefObject<number>;
}

export interface StripPackingAlgorithmHandle {
  place: (
    inventoryRect: ColorRect<RectangleConfig>
  ) => [string, number] | undefined;
}

const StripPackingAlgorithm = React.forwardRef<
  StripPackingAlgorithmHandle,
  StripPackingAlgorithmProps
>(
  (
    {
      x,
      height,
      width,
      inventory,
      algorithm,
      inventoryWidth,
      inventoryScrollOffset,
    },
    ref
  ) => {
    const [algo, setAlgo] = useState<PackingAlgorithm<
      RectangleConfig,
      any
    > | null>(null);

    const [stripRects, setStripRects] = useState<
      ColorRect<RectangleConfig & PrevPos>[]
    >([]);

    const [order, setOrder] = useState(0);

    const setScore = useScoreStore(useCallback(state => state.setScore, []));

    useEffect(() => {
      const _height = stripRects.reduce(
        (maxY, r) => Math.max(maxY, Math.round(r.y * -1)),
        0
      );
      setScore(
        {
          height: _height,
        },
        'algorithm'
      );
    }, [stripRects, height]);

    const getAlgo = (algorithm: PackingAlgorithms) => {
      const size = { width, height };
      // algorithms change the array, we cannot allow that
      const invCopy = [...inventory];
      switch (algorithm) {
        case NEXT_FIT_DECREASING_HEIGHT: {
          const a = new NextFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(invCopy);
          return a;
        }
        case FIRST_FIT_DECREASING_HEIGHT: {
          const a = new FirstFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(invCopy);
          return a;
        }
        case BEST_FIT_DECREASING_HEIGHT: {
          const a = new BestFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(invCopy);
          return a;
        }

        case SIZE_ALTERNATING_STACK: {
          const a = new SizeAlternatingStack<ColorRect<RectangleConfig>>(
            size
          ).load(invCopy);
          return a;
        }

        default:
          throw Error('unkown algorithm: ' + algorithm);
      }
    };

    const [prevInventory, setPrevInventory] = useState('');

    useEffect(() => {
      const newInv = JSON.stringify(inventory.map(({ name }) => name).sort());
      // only reset if the names (ids) changes
      if (prevInventory === newInv) return;
      setPrevInventory(newInv);
      const algo = getAlgo(algorithm);
      setAlgo(algo);
      setStripRects([]);
      setScore({ height: 0 }, 'algorithm');
    }, [inventory, algorithm]);

    useImperativeHandle(ref, () => ({
      place: (_: ColorRect<RectangleConfig>) => {
        if (algo?.isFinished()) return;

        const rect = algo?.place();

        if (!rect) return;
        const inventoryRect = inventory.find(r => r.name === rect.name)!;

        // add the scroll offet to y value
        const scrollOffset = inventoryScrollOffset.current ?? 0;
        const newRect = {
          ...rect,
          prevX: inventoryRect.x - inventoryWidth, // substract the inventory width (its relative to the strip)
          prevY: inventoryRect.y - scrollOffset,
        };
        setStripRects(prev => [...prev, newRect]);
        const rOrder = order;
        setOrder(old => old + 1);
        return [rect.name, rOrder];
      },
    }));

    return (
      <Layer x={x}>
        {stripRects.map((r, i) => {
          return (
            <MyRect
              key={r.name}
              {...r}
              strokeWidth={2}
              stroke={'#002050FF'}
              y={r.y + height}
              id={`STRIP_RECT`}
            />
          );
        })}
      </Layer>
    );
  }
);

const ENTER_ANIMATION_DURATION_SECONDS = 0.5;

const MyRect: React.FC<PrevPos & RectConfig & KonvaNodeEvents> = ({
  x,
  y,
  prevX,
  prevY,
  ...props
}) => {
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

  return (
    <Rect
      ref={ref}
      x={prevX}
      y={prevY}
      stroke={'rgba(0,0,0,0.2)'}
      strokeWidth={1}
      {...props}></Rect>
  );
};

export default StripPackingAlgorithm;
