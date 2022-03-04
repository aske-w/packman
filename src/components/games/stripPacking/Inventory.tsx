import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import React, { useRef } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import {
  CanvasProps,
  INVENTORY_SIZE,
  SCROLLBAR_WIDTH,
} from '../../../config/canvasConfig';
import { ColorRect } from '../../../types/ColorRect.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import ScrollBar from '../../canvas/ScrollBar';
import { PADDING } from '../../../config/canvasConfig';
import { Vector2d } from 'konva/lib/types';

interface InventoryProps {
  stripWidth: number;
  inventoryWidth: number;
  gameHeight: number;
  dynamicInventory: ColorRect[];
  staticInventory: ReadonlyArray<ColorRect & { order?: number }>;
  onDraggedToStrip: (rectName: string, pos: Vector2d) => void;
}

const Inventory = React.forwardRef<KonvaLayer, InventoryProps>(
  (
    {
      dynamicInventory,
      staticInventory,
      stripWidth: stripWidth,
      inventoryWidth,
      gameHeight,
      onDraggedToStrip,
    },
    ref
  ) => {
    const handleDragEnd = (evt: KonvaEventObject<DragEvent>) => {
      const rect = evt.target;
      const { name, width } = rect.getAttrs();

      const { x: x, y: y } = dynamicInventory.find(r => r.name === name)!;
      const { x: dropX, y: dropY } = rect.getAbsolutePosition();

      const inStripArea = dropX + width < stripWidth;
      if (inStripArea) {
        return onDraggedToStrip(name, { x: dropX, y: dropY });
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

    // const [tooltip, setTooltip] = useState<Partial<TextConfig>>({
    //   text: '',
    //   x: 0,
    //   y: 0,
    //   visible: false,
    // });
    // const enableTooltip = (rect: Rectangle) => {
    //   var mousePos = ref?.();
    //   if (!mousePos) return;
    //   setTooltip({
    //     text: `Width: ${rect.width}, height: ${rect.height}`,
    //     x: mousePos.x,
    //     y: mousePos.y,
    //     visible: true,
    //   });
    // };
    // const disableTooltip = () => {
    //   setTooltip({
    //     visible: false,
    //   });
    // };

    // const getTooltipPos = (x: number) => {
    //   const threshold = 100;
    //   const closeToLeft = x < threshold;
    //   const closeToRight = size.width - x < threshold;
    //   if (!closeToLeft && !closeToRight) {
    //     return 'down';
    //   }
    //   if (closeToLeft) return 'left';
    //   if (closeToRight) return 'right';
    // };

    return (
      <>
        <Layer x={stripWidth} y={0} ref={ref} name="INVENTORY_LAYER">
          {staticInventory.map((r, i) => {
            return (
              <Rect
                key={r.name + 'ghost'}
                {...r}
                opacity={0.2}
                strokeWidth={1}
                id={`INVENTORY_GHOST_RECT`}
              />
            );
          })}
          {dynamicInventory.map((r, i) => {
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
      </>
    );
  }
);

export default Inventory;
