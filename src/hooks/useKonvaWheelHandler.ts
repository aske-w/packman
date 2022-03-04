import { KonvaEventObject, Node } from 'konva/lib/Node';
import { Layer as KonvaLayer, Layer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import {
  GAME_HEIGHT,
  INVENTORY_SIZE,
  KonvaWheelEvent,
  PADDING,
  SCROLLBAR_HEIGHT,
} from '../config/canvasConfig';
import { useCallback, RefObject, MutableRefObject } from 'react';

interface WheelHandlerParams {
  layerRef: RefObject<KonvaLayer>;
  scrollBarRef: RefObject<KonvaRect>;
  scrollableHeight: number;
  gameHeight: number;
  area: { minX: number; maxX: number };
  scrollOffsetRef?: MutableRefObject<number>;
}

type InitializedScrollHandler = (
  e: (KonvaEventObject<WheelEvent> & KonvaWheelEvent)['evt']
) => void;
type ScrollHandler = (params: WheelHandlerParams) => InitializedScrollHandler;
interface UseKonvaWheelHandlerParams {
  handlers: InitializedScrollHandler[];
}

export const useKonvaWheelHandler = ({
  handlers,
}: UseKonvaWheelHandlerParams) => {
  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent> & KonvaWheelEvent) => {
      e.evt.preventDefault();
      for (const handler of handlers) {
        handler(e.evt);
      }
    },
    [handlers]
  );

  return handleWheel;
};

export const inventoryScrollHandler: ScrollHandler =
  ({
    layerRef,
    gameHeight,
    scrollBarRef,
    scrollableHeight,
    area,
    scrollOffsetRef,
  }) =>
  e => {
    const { layerX, deltaY } = e;

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
      if (scrollOffsetRef) {
        scrollOffsetRef.current = vy;
      }
      return;
    }
  };
export const interactiveScrollHandler: ScrollHandler =
  ({ layerRef, gameHeight, scrollBarRef, scrollableHeight, area }) =>
  e => {
    const { layerX, deltaY } = e;

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
  };
