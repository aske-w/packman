import React from "react";
import { Layer, Rect } from "react-konva";
import { CanvasProps, INVENTORY_SIZE } from "../../../config/canvasConfig";
import { ColorRect } from "../../../types/ColorRect.interface";
import { DimensionsWithConfig } from "../../../types/DimensionsWithConfig.type";
import { RectangleConfig } from "../../../types/RectangleConfig.interface";

interface InventoryProps {
  x: number;
  gameHeight: number;
  inventory: ColorRect[];
}

const Inventory: React.FC<InventoryProps> = ({ inventory, x, gameHeight }) => {
  return (
    <>
      <Layer
        {...INVENTORY_SIZE}
        height={gameHeight}
        x={x}
        y={0}
        //   ref={inventoryLayer}
        name="INVENTORY_LAYER"
      >
        {inventory.map((r, i) => {
          return (
            <Rect
              key={r.name}
              {...r}
              // onDragMove={handleDragMove}
              draggable
              strokeWidth={1}
              stroke={"orange"}
              // y={scrollableInventoryHeight + r.y}
              // onDragEnd={handleInventoryDragEnd}
              id={`INVENTORY_RECT`}
            />
          );
        })}
      </Layer>
    </>
  );
};

export default Inventory;
