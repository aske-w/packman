import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Inventory from "../../components/games/stripPacking/Inventory";
import StripPackingAlgorithm, {
  StripPackingAlgorithmHandle,
} from "../../components/games/stripPacking/StripPackingAlgorithm";
import { NAV_HEIGHT } from "../../config/canvasConfig";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  interactiveScrollHandler,
  inventoryScrollHandler,
  useKonvaWheelHandler,
} from "../../hooks/useKonvaWheelHandler";
import { ColorRect } from "../../types/ColorRect.interface";
import { generateInventory } from "../../utils/generateData";
import { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import ScrollBar from "../../components/canvas/ScrollBar";
import { SCROLLBAR_WIDTH, PADDING } from "../../config/canvasConfig";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { RectangleConfig } from "../../types/RectangleConfig.interface";

import StripPackingInteractive, {
  StripPackingInteractiveHandle,
} from "../../components/games/stripPacking/StripPackingInteractive";
import { Vector2d } from "konva/lib/types";
import useAlgorithmStore from "../../store/algorithm";
import useScoreStore from "../../store/score";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.2;
  const inventoryWidth = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;

  const algorithm = useAlgorithmStore(
    useCallback((state) => state.algorithm, [])
  );
  const setRectanglesLeft = useScoreStore(
    useCallback((state) => state.setRectanglesLeft, [])
  );

  /**
   * This is the immutable inventory, used for rendering the ghosts
   */
  const [startingInventory, setStartingInventory] = useState<
    ReadonlyArray<ColorRect<RectangleConfig & { order?: number }>>
  >(() => generateInventory(inventoryWidth, 25));

  /**
   * This is the inventory, used for rendering the draggable rects. Whenever an
   * item is placed in the strip, it's removed from this array
   */
  const [renderInventory, setRenderInventory] = useState<
    ColorRect<RectangleConfig>[]
  >([]);
  useEffect(() => {
    setRenderInventory([...startingInventory]);
  }, [startingInventory]);

  const algoRef = useRef<StripPackingAlgorithmHandle>(null);
  const interactiveRef = useRef<StripPackingInteractiveHandle>(null);

  const onDraggedToStrip = (rectName: string, pos: Vector2d) => {
    const rIdx = renderInventory.findIndex((r) => r.name === rectName);

    if (rIdx !== -1) {
      const rect = renderInventory[rIdx];
      // Place in algorithm canvas
      const res = algoRef.current?.place(rect);

      // place in interactive canvas (update its state)
      interactiveRef.current?.place(rect, pos);

      setRenderInventory((old) => {
        const tmp = [...old];
        tmp.splice(rIdx, 1);
        return tmp;
      });

      setRectanglesLeft(renderInventory.length - 1);

      if (res) {
        const [placedName, order] = res;
        console.log(res);

        // give the order of placement to the starting state
        // setStartingInventory(old => {
        //   const tmp = [...old];
        //   const idx = tmp.findIndex(r => r.name === placedName);
        //   if (idx === -1) return old;
        //   tmp[idx].order = order;
        //   return tmp;
        // });
      }
    }
  };
  // inventory scroll
  const inventoryScrollBarRef = useRef<KonvaRect>(null);
  const inventoryLayer = useRef<KonvaLayer>(null);
  const inventoryScrollOffsetRef = useRef(0);

  // interactive scroll
  const interactiveScrollBarRef = useRef<KonvaRect>(null);
  const interactiveLayerRef = useRef<KonvaLayer>(null);
  const interactiveScrollOffsetRef = useRef(0);

  const scrollableHeight = gameHeight * 2;
  const handleWheel = useKonvaWheelHandler({
    handlers: [
      inventoryScrollHandler({
        area: {
          minX: stripWidth,
          maxX: stripWidth + inventoryWidth,
        },
        gameHeight,
        layerRef: inventoryLayer,
        scrollBarRef: inventoryScrollBarRef,
        scrollableHeight,
        scrollOffsetRef: inventoryScrollOffsetRef,
      }),
      interactiveScrollHandler({
        area: {
          minX: 0,
          maxX: stripWidth,
        },
        gameHeight,
        layerRef: interactiveLayerRef,
        scrollBarRef: interactiveScrollBarRef,
        scrollableHeight,
        scrollOffsetRef: interactiveScrollOffsetRef,
      }),
    ],
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <Stage
          onWheel={handleWheel}
          width={window.innerWidth}
          height={gameHeight}
        >
          <Layer>
            {/* Strip canvas */}
            <Rect fill="#555" x={0} width={stripWidth} height={gameHeight} />
            {/* Inventory */}
            <Rect
              fill="#333"
              x={stripWidth}
              width={inventoryWidth}
              height={gameHeight}
            />
            {/* Algorithm canvas */}
            <Rect
              fill="#555"
              x={inventoryWidth + stripWidth}
              width={stripWidth}
              height={gameHeight}
            />
            <ScrollBar
              startPosition="top"
              ref={inventoryScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth + inventoryWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={(newY) => inventoryLayer.current?.y(newY)}
            />
            <ScrollBar
              startPosition="bottom"
              ref={interactiveScrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={(newY) => {
                interactiveLayerRef.current?.y(newY);
              }}
            />
          </Layer>
          <StripPackingInteractive
            scrollableHeight={scrollableHeight}
            ref={interactiveRef}
            layerRef={interactiveLayerRef}
            width={stripWidth}
            height={gameHeight}
            inventoryScrollOffset={inventoryScrollOffsetRef}
            interactiveScrollOffset={interactiveScrollOffsetRef}
          />
          <Inventory
            ref={inventoryLayer}
            staticInventory={startingInventory}
            dynamicInventory={renderInventory}
            {...{
              onDraggedToStrip,
              stripWidth: stripWidth,
              inventoryWidth: inventoryWidth,
              gameHeight,
            }}
          />

          <StripPackingAlgorithm
            inventoryScrollOffset={inventoryScrollOffsetRef}
            ref={algoRef}
            inventoryWidth={inventoryWidth}
            x={inventoryWidth + stripWidth}
            width={stripWidth}
            height={gameHeight}
            inventory={startingInventory}
            algorithm={algorithm}
          />
        </Stage>
      </div>
    </div>
  );
};

export default StripPackingGame;
