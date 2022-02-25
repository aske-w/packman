import { RectConfig } from "konva/lib/shapes/Rect";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { KonvaNodeEvents, Layer, Rect } from "react-konva";
import { BestFitDecreasingHeight } from "../../../algorithms/BestFitDecreasingHeight";
import { FirstFitDecreasingHeight } from "../../../algorithms/FirstFitDecreasingHeight";
import { NextFitDecreasingHeight } from "../../../algorithms/NextFitDecreasingHeight";
import { SizeAlternatingStack } from "../../../algorithms/SizeAlternatingStack";
import { GAME_HEIGHT, STRIP_SIZE } from "../../../config/canvasConfig";
import { ColorRect } from "../../../types/ColorRect.interface";
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from "../../../types/PackingAlgorithm.interface";
import { RectangleConfig } from "../../../types/RectangleConfig.interface";
import {
  Rect as KonvaRect,
  RectConfig as KonvaRectConfig,
} from "konva/lib/shapes/Rect";
import Konva from "konva";

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
  inventory: ColorRect<RectangleConfig>[];
  inventoryWidth: number;
}

export interface StripPackingAlgorithHandle {
  place: (inventoryRect: ColorRect<RectangleConfig>) => string | undefined;
}

const StripPackingAlgorithm = React.forwardRef<
  StripPackingAlgorithHandle,
  StripPackingAlgorithmProps
>(({ x, height, width, inventory: input, algorithm, inventoryWidth }, ref) => {
  const [algo, setAlgo] = useState<PackingAlgorithm<
    RectangleConfig,
    any
  > | null>(null);

  const inventory = useMemo(() => input, []);

  const [stripRects, setStripRects] = useState<
    ColorRect<RectangleConfig & PrevPos>[]
  >([]);

  useEffect(() => {
    const getAlgo = (algorithm: PackingAlgorithms) => {
      const size = { width, height };
      switch (algorithm) {
        case NEXT_FIT_DECREASING_HEIGHT: {
          const a = new NextFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(inventory);
          return a;
        }
        case FIRST_FIT_DECREASING_HEIGHT: {
          const a = new FirstFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(inventory);
          return a;
        }
        case BEST_FIT_DECREASING_HEIGHT: {
          const a = new BestFitDecreasingHeight<ColorRect<RectangleConfig>>(
            size
          ).load(inventory);
          return a;
        }

        case SIZE_ALTERNATING_STACK: {
          const a = new SizeAlternatingStack<ColorRect<RectangleConfig>>(
            size
          ).load(inventory);
          return a;
        }

        default:
          throw Error("unkown algorithm: " + algorithm);
      }
    };

    const algo = getAlgo(algorithm);
    setAlgo(algo);
  }, [algorithm, inventory]);

  useImperativeHandle(ref, () => ({
    place: (inventoryRect: ColorRect<RectangleConfig>) => {
      console.log("called: ", inventoryRect);
      if (algo?.isFinished()) return;

      const rect = algo?.place();

      if (!rect) return;

      setStripRects((prev) => [
        ...prev,
        {
          ...rect,
          prevX: inventoryRect.x - inventoryWidth,
          prevY: inventoryRect.y,
        },
      ]);

      console.log("NEW RECGT: ", {
        ...rect,
        prevX: inventoryRect.x - inventoryWidth,
        prevY: inventoryRect.y,
      });

      return rect.name;
    },
  }));

  return (
    <Layer {...{ x, height, width }}>
      {stripRects.map((r, i) => {
        return (
          <MyRect
            key={r.name}
            {...r}
            x={0}
            strokeWidth={2}
            stroke={"#002050FF"}
            y={height}
            id={`STRIP_RECT`}
          />
        );
      })}
    </Layer>
  );
});

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
      y={prevY + GAME_HEIGHT}
      stroke={"rgba(0,0,0,0.2)"}
      strokeWidth={1}
      {...props}
    ></Rect>
  );
};

export default StripPackingAlgorithm;
