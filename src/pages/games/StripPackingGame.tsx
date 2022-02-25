import Konva from "konva";
import React, { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Inventory from "../../components/games/stripPacking/Inventory";
import StripPackingAlgorithm, {
  StripPackingAlgorithmCanvasHandle,
} from "../../components/games/stripPacking/StripPackingAlgorithm";
import StripPackingInteractive from "../../components/games/stripPacking/StripPackingInteractive";
import {
  GAME_HEIGHT,
  genId,
  genInventory,
  INVENTORY_SIZE,
  NAV_HEIGHT,
  PADDING,
  STAGE_SIZE,
} from "../../config/canvasConfig";
import { useWindowSize } from "../../hooks/useWindowSize";
import { ColorRect } from "../../types/ColorRect.interface";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";
import { generateInventory } from "../../utils/generateData";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const { width: wWidth, height: wHeight } = useWindowSize();
  const stripSize = wWidth * 0.2;
  const inventorySize = wWidth * 0.6;
  const gameHeight = wHeight - NAV_HEIGHT;
  const [inventory, setInventory] = useState(() =>
    generateInventory(inventorySize)
  );

  const place = (name: string) => {};

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <Stage width={window.innerWidth} height={gameHeight}>
          <Layer>
            {/* Strip canvas */}
            <Rect fill="#555" x={0} width={stripSize} height={gameHeight} />
            {/* Inventory */}
            <Rect
              fill="#333"
              x={stripSize}
              width={inventorySize}
              height={gameHeight}
            />
            {/* Algorithm canvas */}
            <Rect
              fill="#555"
              x={inventorySize + stripSize}
              width={stripSize}
              height={gameHeight}
            />
          </Layer>
          <Inventory
            {...{
              x: stripSize,
              inventory,
              gameHeight,
            }}
          />
        </Stage>
        {/* <StripPackingInteractive
          {...{ input, scrollableStripHeight }}
          onDragDrop={onStripDrop}
        ></StripPackingInteractive>
        <StripPackingAlgorithm
          {...{
            input,
            scrollableStripHeight,
            ref,
            algorithm: PackingAlgorithms.SIZE_ALTERNATING_STACK,
          }}
        ></StripPackingAlgorithm> */}
      </div>
    </div>
  );
};

export default StripPackingGame;
