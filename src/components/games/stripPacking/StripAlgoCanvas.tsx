import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { KonvaNodeEvents, Layer, Rect, Stage } from "react-konva";
import { BestFitDecreasingHeight } from "../../../algorithms/BestFitDecreasingHeight";
import { FirstFitDecreasingHeight } from "../../../algorithms/FirstFitDecreasingHeight";
import { NextFitDecreasingHeight } from "../../../algorithms/NextFitDecreasingHeight";
import {
  CanvasProps,
  GAME_HEIGHT,
  INVENTORY_SIZE,
  PADDING,
  SCROLLABLE_HEIGHT,
  STAGE_SIZE,
  STRIP_SIZE,
} from "../../../config/canvasConfig";
import { ColorRect } from "../../../types/ColorRect.interface";
import { Dimensions } from "../../../types/Dimensions.interface";
import {
  PackingAlgorithms,
  PackingAlgorithm,
} from "../../../types/PackingAlgorithm.interface";
import { DimensionsWithConfig } from "../../../types/DimensionsWithConfig.type";
import { RectangleConfig } from "../../../types/RectangleConfig.interface";
import Konva from "konva";
import { Rect as KonvaRect, RectConfig } from "konva/lib/shapes/Rect";
import { Layer as KonvaLayer } from "konva/lib/Layer";

const {
  BEST_FIT_DECREASING_HEIGHT,
  NEXT_FIT_DECREASING_HEIGHT,
  FIRST_FIT_DECREASING_HEIGHT,
  SIZE_ALTERNATING_STACK,
} = PackingAlgorithms;

interface StripAlgoCanvasProps extends CanvasProps {
  algorithm: PackingAlgorithms;
}

export interface StripAlgoCanvasHandle {
  place(): void;
}

type PrevPos = { prevX: number; prevY: number };

const ENTER_ANIMATION_DURATION_SECONDS = 0.5;

const StripAlgoCanvas = React.forwardRef<
  StripAlgoCanvasHandle,
  StripAlgoCanvasProps
>(({ input, algorithm }, ref) => {
  const [stripRects, setStripRects] = useState<
    ColorRect<RectangleConfig & PrevPos>[]
  >([]);
  const [inventoryRects, setInventoryRects] = useState<
    ColorRect<RectangleConfig>[]
  >([]);

  const [algo, setAlgo] = useState<PackingAlgorithm<RectangleConfig> | null>(
    null
  );

  const inventoryTranslateY = useRef(0);

  const calcInitialPositions = (
    rects: DimensionsWithConfig<RectangleConfig>[]
  ) => {
    return rects.reduce<ColorRect<RectangleConfig>[]>((acc, attrs, i) => {
      const { height, width } = attrs;
      const x = INVENTORY_SIZE.width / 2 - width / 2;
      if (i === 0) {
        acc.push({
          ...attrs,
          x,
          y: -height - PADDING,
        });
      } else {
        const prev = acc[i - 1];
        acc.push({
          ...attrs,
          x,
          y: prev.y - height - PADDING,
        });
      }

      return acc;
    }, []);
  };

  useEffect(() => {
    const getAlgo = (algorithm: PackingAlgorithms) => {
      const size = { ...STRIP_SIZE };
      switch (algorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          return new NextFitDecreasingHeight(size).load(input);

        case FIRST_FIT_DECREASING_HEIGHT:
          return new FirstFitDecreasingHeight(size).load(input);

        case BEST_FIT_DECREASING_HEIGHT:
          return new BestFitDecreasingHeight(size).load(input);

        default:
          throw Error("unkown algorithm: " + algorithm);
      }
    };

    const algo = getAlgo(algorithm);
    setAlgo(algo);
    setInventoryRects(calcInitialPositions(algo.getSortedData()));
  }, [algorithm]);

  useImperativeHandle(ref, () => ({
    place: () => {
      if (algo?.isFinished()) return;
      const rect = algo?.place();
      if (rect) {
        const curIdx = inventoryRects.findIndex((r) => r.name === rect.name)!;
        const { x: prevX, y: prevY, height } = inventoryRects[curIdx];
        // add to strip
        setStripRects((prev) => [
          ...prev,
          {
            ...rect,
            prevX,
            prevY: prevY + inventoryTranslateY.current,
          },
        ]);
        // add to remove from inventory
        setInventoryRects(inventoryRects.filter((_, i) => i !== curIdx));
        // update the inventory y translation
        inventoryTranslateY.current =
          inventoryTranslateY.current + height + PADDING;

        // animate to position
        setTimeout(() => {
          new Konva.Tween({
            node: inventoryLayer.current!,
            y: inventoryTranslateY.current,
            easing: Konva.Easings.EaseInOut,
            duration: 0.3,
          }).play();
        }, ENTER_ANIMATION_DURATION_SECONDS * 1000);
      }
    },
  }));

  const inventoryLayer = useRef<KonvaLayer>(null);

  return (
    <div className="h-full p-10">
      <div className="w-1/2">
        <div className="flex flex-col w-1/2 px-2 mb-4 font-bold bg-white">
          <span>Total height: 0</span>
          <span>Rectangles left: {inventoryRects.length}</span>
        </div>
        <Stage {...STAGE_SIZE}>
          <Layer>
            <Rect fill="#ffffff" {...STRIP_SIZE} />
            <Rect fill="gold" {...INVENTORY_SIZE} />

            {stripRects.map((r) => {
              return (
                <MyRect
                  key={r.name}
                  {...r}
                  x={r.x + INVENTORY_SIZE.width}
                  strokeWidth={2}
                  stroke={"#002050FF"}
                  y={GAME_HEIGHT + r.y}
                  id={`STRIP_RECT`}
                />
              );
            })}
          </Layer>
          <Layer ref={inventoryLayer}>
            {inventoryRects.map((r) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  strokeWidth={2}
                  stroke={"#002050FF"}
                  y={GAME_HEIGHT + r.y}
                  id={`INVENTORY_RECT`}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default StripAlgoCanvas;

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
