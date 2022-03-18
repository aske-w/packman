import React, { forwardRef } from 'react';
import { Layer, Rect } from 'react-konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { ColorRect } from '../../../types/ColorRect.interface';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';

interface BinInventoryProps {
  staticInventory: ColorRect[];
  renderInventory: ColorRect[];
  inventoryWidth: number;
  gameHeight: number;
  onDraggedToBin: (name: string, pos: Vector2d) => void;
}

const BinInventory = forwardRef<KonvaLayer, BinInventoryProps>(
  ({ staticInventory, renderInventory, gameHeight, inventoryWidth, onDraggedToBin }, ref) => {
    const handleDragEnd = (evt: KonvaEventObject<DragEvent>) => {
      const rect = evt.target;
      const { name, width } = rect.getAttrs();

      const { x: x, y: y } = renderInventory.find(r => r.name === name)!;

      const { x: dropX, y: dropY } = rect.getAbsolutePosition();

      const inBinArea = dropX + width > inventoryWidth;

      if (inBinArea) {
        return onDraggedToBin(name, { x: dropX, y: dropY });
      }

      // animate back to starting position
      new Konva.Tween({
        x,
        y,
        node: rect,
        duration: 0.4,
        easing: Konva.Easings.EaseOut,
      }).play();
    };

    return (
      <Layer x={0} y={0} ref={ref} name="INVENTORY_LAYER">
        {staticInventory.map((r, i) => {
          return <Rect key={r.name + 'ghost'} {...r} opacity={0.2} strokeWidth={1} id={`INVENTORY_GHOST_RECT`} />;
        })}
        {renderInventory.map((r, i) => {
          return (
            <Rect
              key={r.name}
              {...r}
              // onMouseMove={() => enableTooltip(rect)}
              // onMouseOut={() => disableTooltip()}
              draggable
              strokeWidth={1}
              stroke={'orange'}
              // y={scrollableInventoryHeight + r.y}
              onDragEnd={handleDragEnd}
              id={`INVENTORY_RECT`}
            />
          );
        })}
      </Layer>
    );
  }
);

export default BinInventory;
