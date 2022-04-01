import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Vector2d } from 'konva/lib/types';
import React from 'react';
import { Layer, Group, Rect, Text } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
interface OnlineStripPackingInventoryProps {
  x: number;
  shownInventory: ColorRect[];
  snap: (target: Shape) => void;
  onDraggedToStrip: (rectName: string, pos: Vector2d) => boolean;
}

const OnlineStripPackingInventory = React.forwardRef<KonvaLayer, OnlineStripPackingInventoryProps>(
  ({ shownInventory, x: interactiveWidth, onDraggedToStrip, snap }, ref) => {
    const handleDragEnd = (evt: KonvaEventObject<DragEvent>) => {
      const rect = evt.target;
      const { name, width } = rect.getAttrs();

      const { x: x, y: y } = shownInventory.find(r => r.name === name)!;
      const { x: dropX, y: dropY } = rect.getAbsolutePosition();

      const inStripArea = dropX + width < interactiveWidth;
      console.log(dropX + width, interactiveWidth, inStripArea);

      if (inStripArea) {
        const success = onDraggedToStrip(name, { x: dropX, y: dropY });
        if (success) return;
      }
      // rect.setAttr('fill', staticInventory.find(r => r.name == rect.name())!.fill);
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
      console.log('moving');

      const rect = e.target as Shape;
      rect.moveToTop();
      rect.setAttr('fill', rect.getAttr('fill').substring(0, 7) + '80');
      snap(rect);
    };
    return (
      <Layer ref={ref} x={interactiveWidth}>
        {shownInventory.map((r, i) => (
          <React.Fragment key={r.name}>
            <Rect {...r} onDragEnd={handleDragEnd} onDragMove={handleDragMove} draggable />
            <Text fontSize={20} {...r} listening={false} fill="black" text={`${i}`} />
          </React.Fragment>
        ))}
      </Layer>
    );
  }
);

export default OnlineStripPackingInventory;
