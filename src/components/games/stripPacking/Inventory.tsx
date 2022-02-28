import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import React, { useRef } from 'react';
import { Layer, Rect } from 'react-konva';
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

interface InventoryProps {
  stripWidth: number;
  inventoryWidth: number;
  gameHeight: number;
  inventory: ColorRect[];
  onDraggedToStrip: (rectName: string) => void;
}

const Inventory = React.forwardRef<KonvaLayer, InventoryProps>(
  (
    {
      inventory,
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
      console.log({ name });
      const { x: x, y: y } = inventory.find(r => r.name === name)!;
      const { x: absX } = rect.getAbsolutePosition();

      const inStripArea = absX + width < stripWidth;
      if (inStripArea) {
        return onDraggedToStrip(name);
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
        <Layer
          // height={gameHeight}
          x={stripWidth}
          y={0}
          ref={ref}
          name="INVENTORY_LAYER">
          {inventory.map((r, i) => {
            return (
              <Rect
                key={r.name + 'ghost'}
                {...r}
                opacity={0.2}
                strokeWidth={1}
                id={`INVENTORY_RECT`}
              />
            );
          })}
          {inventory.map((r, i) => {
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
      </>
    );
  }
);

export default Inventory;
