import React, { useEffect, useImperativeHandle, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { BestFitDecreasingHeight } from "../../../algorithms/BestFitDecreasingHeight";
import { FirstFitDecreasingHeight } from "../../../algorithms/FirstFitDecreasingHeight";
import { NextFitDecreasingHeight } from "../../../algorithms/NextFitDecreasingHeight";
import { SizeAlternatingStack } from "../../../algorithms/SizeAlternatingStack";
import {
  CanvasProps,
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

const {
  BEST_FIT_DECREASING_HEIGHT,
  NEXT_FIT_DECREASING_HEIGHT,
  FIRST_FIT_DECREASING_HEIGHT,
  SIZE_ALTERNATING_STACK,
} = PackingAlgorithms;

interface StripAlgoCanvasProps extends CanvasProps {
  algorithm: PackingAlgorithms;
}

interface StripAlgoCanvasHandle {
  place(): void;
}

const StripAlgoCanvas = React.forwardRef<
  StripAlgoCanvasHandle,
  StripAlgoCanvasProps
>(({ input, algorithm }, ref) => {
  const [stripRects, setStripRects] = useState<ColorRect<{}>[]>([]);
  const [inventoryRects, setInventoryRects] = useState<
    DimensionsWithConfig<RectangleConfig>[]
  >([]);

  const [algo, setAlgo] = useState<PackingAlgorithm | null>(null);

  const calcInitialPositions = (rects: DimensionsWithConfig[]) => {
    return rects.map<ColorRect<{}>>((attrs, i, arr) => {
      const { height } = attrs;
      const x = INVENTORY_SIZE.width / 2 + PADDING;
      if (i === 0) {
        return {
          ...attrs,
          x,
          y: -height - PADDING,
        };
      } else {
        const prev = (arr as ColorRect[])[i - 1];
        return {
          ...attrs,
          x,
          y: prev.y - height - PADDING,
        };
      }
    });
  };

  useEffect(() => {
    const getAlgo = (algorithm: PackingAlgorithms) => {
      const size = { ...STAGE_SIZE };
      switch (algorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          const a = new NextFitDecreasingHeight(size).load(inventoryRects);
          // .getSortedData();
          return a;
          break;

        // case FIRST_FIT_DECREASING_HEIGHT:
        //   return new FirstFitDecreasingHeight(size).load(inventoryRects);

        //   break;

        // case BEST_FIT_DECREASING_HEIGHT:
        //   return new BestFitDecreasingHeight(size).load(inventoryRects);

        //   break;

        default:
          throw Error("unkown algorithm: " + algorithm);
      }
    };

    const algo = getAlgo(algorithm);
    setAlgo(algo);
    setInventoryRects(algo.getSortedData());
  }, [algorithm]);

  useImperativeHandle(ref, () => ({
    place: () => {
      const rect = algo?.place();
      if (rect) {
        setStripRects((prev) => [...prev, rect]);
      }
    },
  }));

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
            <Rect fill="#eee000" {...INVENTORY_SIZE} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default StripAlgoCanvas;

/*
          <Layer {...STRIP_SIZE}>
            {stripRects.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  draggable
                  strokeWidth={2}
                  stroke="red"
                  y={STRIP_SIZE.height + r.y}
                  id={`STRIP_RECT`}
                />
              );
            })}
          </Layer>
          <Layer
            {...INVENTORY_SIZE}
            height={INVENTORY_SIZE.height}
            x={0}
            name="INVENTORY_LAYER"
          >
            {inventoryRects.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  strokeWidth={2}
                  stroke={"#002050FF"}
                  y={SCROLLABLE_HEIGHT + r.y}
                  id={`INVENTORY_RECT`}
                />
              );
            })}
          </Layer>
 */
