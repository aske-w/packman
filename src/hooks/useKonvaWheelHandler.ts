import { KonvaEventObject } from 'konva/lib/Node';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { KonvaWheelEvent, PADDING, SCROLLBAR_HEIGHT } from '../config/canvasConfig';
import { useCallback, RefObject } from 'react';
import { isNumber } from 'lodash';

interface WheelHandlerParams {
  layerRef: RefObject<KonvaLayer>;
  scrollBarRef: RefObject<KonvaRect>;
  scrollableHeight: number;
  visibleHeight: number;
  startY?: number;
  activeArea: { minX: number; maxX: number; minY?: number; maxY?: number };
}

interface SidewaysParams {
  layerRef: RefObject<KonvaLayer>;
  scrollBarRef: RefObject<KonvaRect>;
  scrollableWidth: number;
  visibleWidth: number;
  startX?: number;
  activeArea: { minX: number; maxX: number; minY?: number; maxY?: number };
}

type InitializedScrollHandler = (e: (KonvaEventObject<WheelEvent> & KonvaWheelEvent)['evt']) => void;
type ScrollHandler = (params: WheelHandlerParams) => InitializedScrollHandler;
type SidewaysScrollHandler = (params: SidewaysParams) => InitializedScrollHandler;
interface UseKonvaWheelHandlerParams {
  handlers: InitializedScrollHandler[];
}

export const useKonvaWheelHandler = ({ handlers }: UseKonvaWheelHandlerParams) => {
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
  ({ layerRef, startY = 0, visibleHeight, scrollBarRef, scrollableHeight, activeArea }) =>
  e => {
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

      // console.log({dy});

      // TODO fix
      // const minY = startY || -(scrollableHeight - visibleHeight);
      // const maxY = startY ? startY + (scrollableHeight - visibleHeight) : 0;
      const minY = -(scrollableHeight - visibleHeight) + startY;
      const maxY = 0 + startY;
      const availableHeight = visibleHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

      const y = Math.max(minY, Math.min(oldY - dy, maxY));

      // console.log({y}, {minY}, {oldY}, {dy}, {maxY});

      layer.y(y);

      const vy = ((y - startY) / (-scrollableHeight + visibleHeight)) * availableHeight + PADDING;
      
      // console.log({y}, {scrollableHeight}, {visibleHeight}, {availableHeight}, {PADDING}, {vy});

      scrollBarRef.current?.y(vy + startY);

      return;
    }
  };

export const sidewaysScrollHandler: SidewaysScrollHandler = 
  ({ layerRef, startX = 0, visibleWidth, scrollBarRef, scrollableWidth, activeArea }) => e => {
    const { layerX, layerY, deltaX } = e;

    const isActiveX = layerX > activeArea.minX && layerX < activeArea.maxX;
    let isActiveY = true;

    if (isNumber(activeArea.minY) && isNumber(activeArea.maxY)) {
      isActiveY = layerY > activeArea.minY && layerY < activeArea.maxY;
    }

    if (isActiveX && isActiveY) {
      const layer = layerRef.current!;
      const dx = deltaX;
      const oldX = layer.x();

      // console.log({dy});

      // TODO fix
      // const minY = startY || -(scrollableHeight - visibleHeight);
      // const maxY = startY ? startY + (scrollableHeight - visibleHeight) : 0;
      const minX = -(scrollableWidth - visibleWidth) + startX;
      const maxX = 0 + startX;
      const availableWidth = visibleWidth - PADDING * 2 - SCROLLBAR_HEIGHT;

      const x = Math.max(minX, Math.min(oldX - dx, maxX));

      // console.log({y}, {minY}, {oldY}, {dy}, {maxY});

      layer.x(x);

      const vx = ((x - startX) / (-scrollableWidth + visibleWidth)) * availableWidth + PADDING;
      
      // console.log({y}, {scrollableHeight}, {visibleHeight}, {availableHeight}, {PADDING}, {vy});

      scrollBarRef.current?.x(vx + startX);

      return;
    }
};