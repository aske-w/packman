import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import React, { useCallback } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Vector2d } from 'konva/lib/types';
import { Shape } from 'konva/lib/Shape';
import { useKeepOnMouse } from '../../../hooks/useKeepOnMouse';
import useEventStore from '../../../store/event.store';
import { Events } from '../../../types/enums/Events.enum';

interface InventoryProps {
  stripWidth: number;
  dynamicInventory: ColorRect[];
  staticInventory: ReadonlyArray<ColorRect & { order?: number }>;
  snap: (target: Shape) => void;
  onDraggedToStrip: (rectName: string, pos: Vector2d) => boolean;
  inventoryWidth: number;
  gameHeight: number;
}

const Inventory = React.forwardRef<KonvaLayer, InventoryProps>(
  ({ dynamicInventory, staticInventory, stripWidth: stripWidth, onDraggedToStrip, snap, gameHeight, inventoryWidth }, ref) => {
    const { dragEndMiddleWare } = useKeepOnMouse();

    const handleDragEnd = (ev: KonvaEventObject<DragEvent>) => {
      dragEndMiddleWare(
        ev,
        evt => {
          const rect = evt.target;
          const { name, width } = rect.getAttrs();

          const { x: dropX, y: dropY } = rect.getAbsolutePosition();

          const inStripArea = dropX + width < stripWidth;
          if (inStripArea) {
            const success = onDraggedToStrip(name, { x: dropX, y: dropY });
            if (success) return true;
          }

          return false;
        },
        evt => {
          const rect = evt.target;
          const { name } = rect.getAttrs();
          const { x: x, y: y } = dynamicInventory.find(r => r.name === name)!;
          rect.setAttr('fill', staticInventory.find(r => r.name == rect.name())!.fill);
          // // animate back to starting position
          new Konva.Tween({
            x,
            y,
            node: rect,
            duration: 0.4,
            easing: Konva.Easings.EaseOut,
          }).play();
        }
      );
    };

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const rect = e.target as Shape;
      rect.moveToTop();
      rect.setAttr('fill', rect.getAttr('fill').substring(0, 7) + '80');
      snap(rect);
    };

    const { event, setEvent } = useEventStore(useCallback(({ event, setEvent }) => ({ event, setEvent }), []));
    if (event === Events.FINISHED || event === Events.GAME_OVER) {
      return (
        <Layer x={stripWidth} ref={ref} y={0}>
          <Rect width={200} height={50} x={inventoryWidth / 2 - 100} cornerRadius={5} y={gameHeight / 2 - 25} fill="red" />
          <Text
            onClick={() => setEvent(Events.RESTART)}
            width={200}
            fontVariant="bold"
            height={50}
            x={inventoryWidth / 2 - 100}
            cornerRadius={10}
            y={gameHeight / 2 - 25}
            align="center"
            verticalAlign="middle"
            fontSize={32}
            fill="white"
            text="Reset"
          />
        </Layer>
      );
    }

    return (
      <>
        <Layer x={stripWidth} y={0} ref={ref} name="INVENTORY_LAYER">
          {staticInventory.map((r, i) => {
            return <Rect key={r.name + 'ghost'} {...r} fill="transparent" stroke={'orange'} strokeWidth={1} id={`INVENTORY_GHOST_RECT`} />;
          })}
          {dynamicInventory.map((r, i) => {
            return (
              <Rect
                key={r.name}
                {...r}
                draggable
                strokeWidth={1}
                stroke={'dodgerblue'}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
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
