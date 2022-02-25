import React, { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Inventory from "../../components/games/stripPacking/Inventory";
import StripPackingAlgorithm, {
  StripPackingAlgorithHandle,
} from "../../components/games/stripPacking/StripPackingAlgorithm";
import { NAV_HEIGHT } from "../../config/canvasConfig";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useKonvaWheelHandler } from "../../hooks/useKonvaWheelHandler";
import { ColorRect } from "../../types/ColorRect.interface";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";
import { generateInventory } from "../../utils/generateData";
import { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import ScrollBar from "../../components/canvas/ScrollBar";
import { SCROLLBAR_WIDTH, PADDING } from "../../config/canvasConfig";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { RectangleConfig } from "../../types/RectangleConfig.interface";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripWidth = wWidth * 0.2;
  const inventoryWidth = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;

  const [inventory, setInventory] = useState(() =>
    generateInventory(inventoryWidth)
  );

  const algoRef = useRef<StripPackingAlgorithHandle>(null);

  const onDraggedToStrip = (rectName: string) => {
    const rect = inventory.find((r) => r.name === rectName);
    console.log({ rect });
    // Place in algorithm canvas
    if (rect) algoRef.current?.place(rect);

    // place in interactive canvas (update its state)
  };
  const scrollBarRef = useRef<KonvaRect>(null);
  const inventoryLayer = useRef<KonvaLayer>(null);
  const scrollableHeight = gameHeight * 2;
  const handleWheel = useKonvaWheelHandler({
    area: {
      minX: stripWidth,
      maxX: stripWidth + inventoryWidth,
    },
    gameHeight,
    layerRef: inventoryLayer,
    scrollBarRef: scrollBarRef,
    scrollableHeight,
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
              ref={scrollBarRef}
              scrollableHeight={scrollableHeight}
              x={stripWidth + inventoryWidth - PADDING - SCROLLBAR_WIDTH}
              gameHeight={gameHeight}
              onYChanged={(newY) => inventoryLayer.current?.y(newY)}
            />
          </Layer>
          <Inventory
            ref={inventoryLayer}
            {...{
              onDraggedToStrip,
              stripWidth: stripWidth,
              inventoryWidth: inventoryWidth,
              inventory,
              gameHeight,
            }}
          />

          <StripPackingAlgorithm
            ref={algoRef}
            inventoryWidth={inventoryWidth}
            x={inventoryWidth + stripWidth}
            width={stripWidth}
            height={gameHeight}
            inventory={inventory}
            algorithm={PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT}
          />
        </Stage>
      </div>
    </div>
  );
};

export default StripPackingGame;
