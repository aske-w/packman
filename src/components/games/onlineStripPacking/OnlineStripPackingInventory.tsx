import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Vector2d } from 'konva/lib/types';
import React, { useCallback } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { ColorRect } from '../../../types/ColorRect.interface';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { useKeepOnMouse } from '../../../hooks/useKeepOnMouse';
import useEventStore from '../../../store/event.store';
import { Events } from '../../../types/enums/Events.enum';
interface OnlineStripPackingInventoryProps {
  x: number;
  visibleInventory: ColorRect[];
  entireInventory: { name: string; fill: string }[];
  snap: (target: Shape) => void;
  onDraggedToStrip: (rectName: string, pos: Vector2d) => Promise<boolean>;
  inventoryWidth: number;
  gameHeight: number;
}

const OnlineStripPackingInventory = React.forwardRef<KonvaLayer, OnlineStripPackingInventoryProps>(
  ({ visibleInventory, x: interactiveWidth, onDraggedToStrip, snap, entireInventory, gameHeight, inventoryWidth }, ref) => {
    const { dragEndMiddleWare } = useKeepOnMouse();

    const handleDragEnd = async (ev: KonvaEventObject<DragEvent>) => {
      dragEndMiddleWare(
        ev,
        async evt => {
          const rect = evt.target;
          const { name, width } = rect.getAttrs();
          const { x: dropX, y: dropY } = rect.getAbsolutePosition();

          const inStripArea = dropX + width < interactiveWidth;

          if (inStripArea) {
            const success = await onDraggedToStrip(name, { x: dropX, y: dropY });
            if (success) return true;
          }

          return false;
        },
        evt => {
          const rect = evt.target;
          const { name } = rect.getAttrs();
          const { x: x, y: y } = visibleInventory.find(r => r.name === name)!;
          // restore normal color
          rect.setAttr('fill', entireInventory.find(r => r.name == rect.name())!.fill);
          // animate back to starting position
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
    if (event === Events.GAME_OVER || event === Events.FINISHED) {
      return (
        <Layer x={interactiveWidth} ref={ref} y={0}>
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
      <Layer ref={ref} x={interactiveWidth}>
        {visibleInventory.map((r, i) => (
          <React.Fragment key={r.name}>
            <Rect {...r} opacity={0.5} />
            <Rect {...r} onDragEnd={handleDragEnd} stroke="rgba(0,0,0,0.3)" strokeWidth={1} onDragMove={handleDragMove} draggable />
          </React.Fragment>
        ))}
      </Layer>
    );
  }
);

export default OnlineStripPackingInventory;
