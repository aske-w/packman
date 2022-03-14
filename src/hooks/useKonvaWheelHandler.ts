import { KonvaEventObject } from "konva/lib/Node";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import {
  KonvaWheelEvent,
  PADDING,
  SCROLLBAR_HEIGHT,
} from "../config/canvasConfig";
import { useCallback, RefObject } from "react";
import { isNumber } from "lodash";

interface WheelHandlerParams {
  layerRef: RefObject<KonvaLayer>;
  scrollBarRef: RefObject<KonvaRect>;
  scrollableHeight: number;
  visibleHeight: number;
  activeArea: { minX: number; maxX: number; minY?: number; maxY?: number };
}

type InitializedScrollHandler = (
  e: (KonvaEventObject<WheelEvent> & KonvaWheelEvent)["evt"]
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

export const defaultScrollHandler: ScrollHandler =
  ({ layerRef, visibleHeight, scrollBarRef, scrollableHeight, activeArea }) =>
  (e) => {
    const { layerX, layerY, deltaY } = e;

    const isActiveX = layerX > activeArea.minX && layerX < activeArea.maxX;
    let isActiveY = true;

    if (isNumber(activeArea.minY) && isNumber(activeArea.maxY)) {
      isActiveY = layerY > activeArea.minY && layerY < activeArea.maxY;
    }

    if (isActiveX && isActiveY) {
      const layer = layerRef.current!;
      const dy = deltaY;
      const oldY = layer.y();

      const minY = -(scrollableHeight - visibleHeight);
      const maxY = 0;

      const y = Math.max(minY, Math.min(oldY - dy, maxY));

      layer.y(y);

      const availableHeight = visibleHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

      const vy =
        (y / (-scrollableHeight + visibleHeight)) * availableHeight + PADDING;

      scrollBarRef.current?.y(vy);

      return;
    }
  };
