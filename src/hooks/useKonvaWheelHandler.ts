import { KonvaEventObject, Node } from "konva/lib/Node";
import { Layer as KonvaLayer, Layer } from "konva/lib/Layer";
import { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import {
  GAME_HEIGHT,
  INVENTORY_SIZE,
  KonvaWheelEvent,
  PADDING,
  SCROLLBAR_HEIGHT,
} from "../config/canvasConfig";
import { useCallback, RefObject } from "react";

interface UseKonvaWheelHandlerParams {
  layerRef: RefObject<KonvaLayer>;
  scrollBarRef: RefObject<KonvaRect>;
  scrollableHeight: number;
  gameHeight: number;
  area: { minX: number; maxX: number };
}

export const useKonvaWheelHandler = ({
  layerRef,
  gameHeight,
  scrollBarRef,
  scrollableHeight,
  area,
}: UseKonvaWheelHandlerParams) => {
  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent> & KonvaWheelEvent) => {
      e.evt.preventDefault();
      const { layerX, deltaY, preventDefault } = e.evt;

      const isActive = layerX > area.minX && layerX < area.maxX;

      if (isActive) {
        const layer = layerRef.current!;
        const dy = deltaY;
        const oldY = layer.y();

        const minY = -(scrollableHeight - gameHeight);
        const maxY = 0;

        const y = Math.max(minY, Math.min(oldY - dy, maxY));

        layer.y(y);

        const availableHeight = gameHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

        const vy =
          (y / (-scrollableHeight + gameHeight)) * availableHeight + PADDING;

        scrollBarRef.current?.y(vy);

        return;
      }
    },
    [layerRef, gameHeight, scrollBarRef, scrollableHeight, area]
  );

  return handleWheel;
};
