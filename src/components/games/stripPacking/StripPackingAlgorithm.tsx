import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { KonvaNodeEvents, Layer, Rect, Stage } from "react-konva";
import { BestFitDecreasingHeight } from "../../../algorithms/BestFitDecreasingHeight";
import { FirstFitDecreasingHeight } from "../../../algorithms/FirstFitDecreasingHeight";
import { NextFitDecreasingHeight } from "../../../algorithms/NextFitDecreasingHeight";
import {
  CanvasProps,
  GAME_HEIGHT,
  GAME_WIDTH,
  INVENTORY_SIZE,
  KonvaWheelEvent,
  PADDING,
  SCROLLBAR_HEIGHT,
  SCROLLBAR_WIDTH,
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
import { SizeAlternatingStack } from "../../../algorithms/SizeAlternatingStack";
import { KonvaEventObject } from "konva/lib/Node";
import ScrollBar from "../../canvas/ScrollBar";

const {
  BEST_FIT_DECREASING_HEIGHT,
  NEXT_FIT_DECREASING_HEIGHT,
  FIRST_FIT_DECREASING_HEIGHT,
  SIZE_ALTERNATING_STACK,
} = PackingAlgorithms;

interface StripPackingAlgorithmCanvasProps extends CanvasProps {
  algorithm: PackingAlgorithms;
}

export interface StripPackingAlgorithmCanvasHandle {
  place(): void;
}

type PrevPos = { prevX: number; prevY: number };

const ENTER_ANIMATION_DURATION_SECONDS = 0.5;

const StripPackingAlgorithm = React.forwardRef<
  StripPackingAlgorithmCanvasHandle,
  StripPackingAlgorithmCanvasProps
>(({ input, algorithm, scrollableStripHeight }, ref) => {
  const [stripRects, setStripRects] = useState<
    ColorRect<RectangleConfig & PrevPos>[]
  >([]);
  const [inventoryRects, setInventoryRects] = useState<
    ColorRect<RectangleConfig>[]
  >([]);

  const stripLayer = useRef<KonvaLayer>(null);
  const inventoryLayer = useRef<KonvaLayer>(null);

  const [algo, setAlgo] = useState<PackingAlgorithm<
    RectangleConfig,
    any
  > | null>(null);

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
        case NEXT_FIT_DECREASING_HEIGHT: {
          const a = new NextFitDecreasingHeight(size).load(input);
          setInventoryRects(calcInitialPositions(a.getSortedData()));
          return a;
        }
        case FIRST_FIT_DECREASING_HEIGHT: {
          const a = new FirstFitDecreasingHeight(size).load(input);
          setInventoryRects(calcInitialPositions(a.getSortedData()));
          return a;
        }
        case BEST_FIT_DECREASING_HEIGHT: {
          const a = new BestFitDecreasingHeight(size).load(input);
          setInventoryRects(calcInitialPositions(a.getSortedData()));
          return a;
        }

        case SIZE_ALTERNATING_STACK: {
          const a = new SizeAlternatingStack(size).load(input);
          const [wide, narrow] = a.getSortedData();

          setInventoryRects(calcInitialPositions(wide.concat(narrow)));
          return a;
        }

        default:
          throw Error("unkown algorithm: " + algorithm);
      }
    };

    const algo = getAlgo(algorithm);
    setAlgo(algo);
  }, [algorithm]);

  useImperativeHandle(ref, () => ({
    place: () => {
      if (algo?.isFinished()) return;
      const rect = algo?.place();
      if (rect) {
        const curIdx = inventoryRects.findIndex((r) => r.name === rect.name)!;
        const { x: prevX, y: prevY, height } = inventoryRects[curIdx];

        const stripScrollOffset = stripLayer.current?.y()!;

        setStripRects((prev) => [
          ...prev,
          {
            ...rect,
            x: rect.x - INVENTORY_SIZE.width,
            y: rect.y - stripScrollOffset,
            prevX: prevX - INVENTORY_SIZE.width,
            prevY: prevY + inventoryTranslateY.current - stripScrollOffset,
          },
        ]);

        const aboveRemoved = inventoryRects.slice(curIdx + 1);

        const updatedRects = aboveRemoved.map((r) => ({
          ...r,
          y: r.y + height + PADDING,
        }));
        updatedRects
          .map((r, i) => {
            const node = inventoryLayer.current?.findOne("." + r.name);
            if (!node) return;

            const last = i === updatedRects.length - 1;

            return new Konva.Tween({
              node,
              y: GAME_HEIGHT + r.y,
              easing: Konva.Easings.EaseInOut,
              duration: 0.3,
            });
          })
          .forEach((t) => t?.play());

        const underRemoved = inventoryRects.slice(0, curIdx);
        setInventoryRects(underRemoved.concat(updatedRects));
        // update the inventory y translation
        // inventoryTranslateY.current =
        //   inventoryTranslateY.current + height + PADDING;

        // animate to position
        // setTimeout(() => {
        //   new Konva.Tween({
        //     node: inventoryLayer.current!,
        //     y: inventoryTranslateY.current,
        //     easing: Konva.Easings.EaseInOut,
        //     duration: 0.3,
        //   }).play();
        // }, ENTER_ANIMATION_DURATION_SECONDS * 1000);
      }
    },
  }));

  const stripVerticalBar = useRef<KonvaRect>(null);
  const handleWheel = (e: KonvaEventObject<WheelEvent> & KonvaWheelEvent) => {
    e.evt.preventDefault();
    const isOutsideInventory = e.evt.layerX > INVENTORY_SIZE.width;

    if (isOutsideInventory) {
      const layer = stripLayer.current!;
      const dy = e.evt.deltaY;
      const oldY = layer.y();

      const minY = -(scrollableStripHeight - GAME_HEIGHT);
      const maxY = 0;

      const y = Math.max(minY, Math.min(oldY - dy, maxY));

      layer.y(y);

      const stageHeight = GAME_HEIGHT;
      const availableHeight = stageHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

      const vy =
        (y / (-scrollableStripHeight + stageHeight)) * availableHeight +
        PADDING;

      stripVerticalBar.current?.y(vy);

      return;
    }
  };

  const totalHeight = useMemo(() => {
    return stripRects.reduce(
      (maxY, { y }) =>
        Math.max(maxY, Math.round(scrollableStripHeight - y - GAME_HEIGHT)),
      0
    );
  }, [stripRects]);

  return (
    <div className="h-full p-10">
      <div className="w-1/2">
        <div className="flex flex-col w-1/2 px-2 mb-4 font-bold bg-white">
          <span>Total height: {totalHeight}</span>
          <span>Rectangles left: {inventoryRects.length}</span>
        </div>
        <Stage onWheel={handleWheel} {...STAGE_SIZE}>
          {/* Background layer */}

          <Layer>
            <Rect fill="#ffffff" {...STRIP_SIZE} />
            <Rect fill="gold" {...INVENTORY_SIZE} />
            <ScrollBar
              ref={stripVerticalBar}
              scrollableHeight={scrollableStripHeight}
              x={GAME_WIDTH - PADDING - SCROLLBAR_WIDTH}
              onYChanged={(newY) => stripLayer.current?.y(newY)}
            />

            {/* {stripRects.map((r) => {
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
            })} */}
          </Layer>

          {/* Strip layer */}
          <Layer
            {...STRIP_SIZE}
            y={-(scrollableStripHeight - STRIP_SIZE.height)}
            ref={stripLayer}
          >
            {stripRects.map((r, i) => {
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
          {/* Inventory layer */}

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

export default StripPackingAlgorithm;

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
