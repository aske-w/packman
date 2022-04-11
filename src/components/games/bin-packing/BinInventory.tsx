import React, { forwardRef } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { ColorRect } from '../../../types/ColorRect.interface';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { BinPackingRect } from '../../../types/BinPackingRect.interface';

interface BinInventoryProps {
  staticInventory: BinPackingRect[];
  renderInventory: ColorRect[];
  inventoryWidth: number;
  gameHeight: number;
  onDraggedToBin: (rect: Shape<ShapeConfig> | Stage, pos: Vector2d) => boolean;
  snap: (target: Shape) => void;
}

const BinInventory = forwardRef<KonvaLayer, BinInventoryProps>(
  ({ staticInventory, renderInventory, gameHeight, inventoryWidth, onDraggedToBin, snap }, ref) => {
    const handleDragEnd = (evt: KonvaEventObject<DragEvent>) => {
      const rect = evt.target;
      const { name, width } = rect.getAttrs();

      const { x: dropX } = rect.getAbsolutePosition();
      const { x: x, y: y, fill } = renderInventory.find(r => r.name === name)!;

      const inBinArea = dropX + width > inventoryWidth;

      if (inBinArea) {
        if (onDraggedToBin(rect, { x, y })) return;
      }

      // Set back original color
      rect.setAttr('fill', fill);

      // animate back to starting position
      new Konva.Tween({
        x,
        y,
        node: rect,
        duration: 0.4,
        easing: Konva.Easings.EaseOut,
      }).play();
    };

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const rect = e.target as Shape;

      rect.moveToTop();
      rect.setAttr('fill', rect.getAttr('fill').substring(0, 7) + '80');
      snap(rect);
    };

    return (
      <Layer x={0} y={0} ref={ref} name="INVENTORY_LAYER">
        {staticInventory.map((r, i) => {
          return <Rect key={r.name + 'ghost'} {...r} fill="transparent" strokeWidth={1} stroke="orange" id={`INVENTORY_GHOST_RECT`} />;
        })}
        {renderInventory.map((r, i) => {
          return (
            <Rect
              key={r.name}
              {...r}
              stroke={'dodgerblue'}
              strokeWidth={1}
              draggable
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              id={`INVENTORY_RECT`}
            />
          );
        })}
        {staticInventory.map((r, i) => {
          return typeof r.order === 'number' ? (
            <Text
              key={r.name + 'ghost_text'}
              text={r.order.toString()}
              fontSize={20}
              fill="white"
              fontVariant="700"
              align="center"
              verticalAlign="middle"
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              listening={false}
            />
          ) : null;
        })}
      </Layer>
    );
  }
);

export default BinInventory;
