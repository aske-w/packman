import Konva from 'konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import React, { RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { KonvaNodeEvents, Layer, Rect } from 'react-konva';
import { BestFitDecreasingHeight } from '../../../algorithms/strip/BestFitDecreasingHeight';
import { FirstFitDecreasingHeight } from '../../../algorithms/strip/FirstFitDecreasingHeight';
import { NextFitDecreasingHeight } from '../../../algorithms/strip/NextFitDecreasingHeight';
import { SizeAlternatingStack } from '../../../algorithms/strip/SizeAlternatingStack';
import { Sleators } from '../../../algorithms/strip/Sleators';
import { SleatorsOptimized } from '../../../algorithms/strip/SleatorsOptimized';
import { ALGO_MOVE_ANIMATION_DURATION as ALGO_ENTER_ANIMATION_DURATION } from '../../../config/canvasConfig';
import useLevelStore from '../../../store/level.store';
import useScoreStore from '../../../store/score.store';
import { ColorRect } from '../../../types/ColorRect.interface';
import { PackingAlgorithmEnum } from '../../../types/enums/OfflineStripPackingAlgorithm.enum';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';

const { BEST_FIT_DECREASING_HEIGHT, NEXT_FIT_DECREASING_HEIGHT, FIRST_FIT_DECREASING_HEIGHT, SIZE_ALTERNATING_STACK, SLEATORS, SLEATORS_OPTIMIZED } =
  PackingAlgorithmEnum;

type PrevPos = { prevX: number; prevY: number };

interface StripPackingAlgorithmProps {
  x: number;
  height: number;
  width: number;
  algorithm: PackingAlgorithmEnum;
  layerRef: RefObject<KonvaLayer>;
  inventory: ReadonlyArray<ColorRect<RectangleConfig>>;
  inventoryWidth: number;

  getInventoryScrollOffset: () => number;
}

export interface StripPackingAlgorithmHandle {
  next(): [ColorRect<RectangleConfig>, number, number] | undefined;
  place: (inventoryRect: ColorRect<RectangleConfig>, idx: number) => [string, number, number] | undefined;
  reset(): void;
}

const StripPackingAlgorithm = React.forwardRef<StripPackingAlgorithmHandle, StripPackingAlgorithmProps>(
  ({ x, height, width, inventory, algorithm, inventoryWidth, layerRef, getInventoryScrollOffset }, ref) => {
    const [algo, setAlgo] = useState<PackingAlgorithm<RectangleConfig, RectangleConfig, any> | null>(null);

    const [stripRects, setStripRects] = useState<ColorRect<RectangleConfig & PrevPos>[]>([]);
    const [order, setOrder] = useState(0);
    const level = useLevelStore(useCallback(state => state.level, []));
    const setScore = useScoreStore(useCallback(state => state.setScore, []));
    const { averageTimeUsed, usedRectsAreaAlgo, setUsedGameAreaAlgo, setUsedRectsAreaAlgo } = useScoreStore();

    useEffect(() => {
      const _height = stripRects.reduce((maxY, r) => Math.max(maxY, Math.round(height - r.y)), 0);
      setUsedGameAreaAlgo(_height * width);
      if (_height === 0) {
        setScore(0, 'algorithm');
        return;
      }

      setScore({ level, usedRectsArea: usedRectsAreaAlgo!, usedGameArea: _height * width, averageTimeUsed }, 'algorithm');
    }, [stripRects, height]);

    const getAlgo = (algorithm: PackingAlgorithmEnum) => {
      const size = { width, height };
      // algorithms change the array, we cannot allow that
      const invCopy = [...inventory];
      switch (algorithm) {
        case NEXT_FIT_DECREASING_HEIGHT: {
          const a = new NextFitDecreasingHeight<ColorRect<RectangleConfig>>(size).load(invCopy);
          return a;
        }
        case FIRST_FIT_DECREASING_HEIGHT: {
          const a = new FirstFitDecreasingHeight<ColorRect<RectangleConfig>>(size).load(invCopy);
          return a;
        }
        case BEST_FIT_DECREASING_HEIGHT: {
          const a = new BestFitDecreasingHeight<ColorRect<RectangleConfig>>(size).load(invCopy);
          return a;
        }

        case SIZE_ALTERNATING_STACK: {
          const a = new SizeAlternatingStack<ColorRect<RectangleConfig>>(size).load(invCopy);
          return a;
        }
        case SLEATORS: {
          const a = new Sleators<ColorRect<RectangleConfig>>(size).load(invCopy);
          return a;
        }
        case SLEATORS_OPTIMIZED: {
          const a = new SleatorsOptimized<ColorRect<RectangleConfig>>(size).load(invCopy);
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
      setScore(0, 'algorithm');
    }, [inventory, algorithm]);

    const reset = useCallback(() => {
      setOrder(0);
      setStripRects([]);
    }, []);

    useImperativeHandle(ref, () => ({
      place: (rect: ColorRect<RectangleConfig>, idx: number) => {
        rect.y = rect.y + height;
        const inventoryRect = inventory[idx]!;

        // remove the scroll offset from y value
        const scrollOffset = getInventoryScrollOffset();

        const newRect = {
          ...rect,
          prevX: inventoryRect.x - inventoryWidth, // substract the inventory width (its relative to the strip)
          prevY: inventoryRect.y - scrollOffset,
        };
        setUsedRectsAreaAlgo(stripRects.reduce((prev, curr) => curr.height * curr.width + prev, newRect.height * newRect.width));
        setStripRects(prev => [...prev, newRect]);
        const rOrder = order;
        setOrder(old => old + 1);
        return [rect.name, rOrder, idx];
      },
      next: () => {
        if (algo?.isFinished()) return;

        const rect = algo?.place();

        if (!rect) return;

        const idx = inventory.findIndex(r => r.name === rect.name)!;

        return [rect, order, idx];
      },
      reset,
    }));

    return (
      <Layer x={x} y={-height} ref={layerRef}>
        {stripRects.map((r, i) => {
          return <MyRect gameHeight={height} key={r.name} {...r} strokeWidth={2} stroke={'#002050FF'} y={r.y + height} id={`STRIP_RECT`} />;
        })}
      </Layer>
    );
  }
);

const MyRect: React.FC<PrevPos & RectConfig & KonvaNodeEvents & { gameHeight: number }> = ({ x, y, prevX, prevY, gameHeight, ...props }) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    new Konva.Tween({
      node: ref.current!,
      duration: ALGO_ENTER_ANIMATION_DURATION,
      x,
      y,
      easing: Konva.Easings.StrongEaseInOut,
    }).play();
  }, [x, y]);

  return <Rect ref={ref} x={prevX} y={prevY + gameHeight} stroke={'rgba(0,0,0,0.2)'} strokeWidth={1} {...props}></Rect>;
};

export default StripPackingAlgorithm;
