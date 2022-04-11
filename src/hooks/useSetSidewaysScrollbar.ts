import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import { RefObject, useEffect } from 'react';
import { PADDING, SCROLLBAR_HEIGHT } from '../config/canvasConfig';

export const useSetSidewaysScrollbar = (
  scrollableWidth: number,
  layerRef: RefObject<KonvaLayer>,
  visibleWidth: number,
  startX: number,
  scrollbarRef: RefObject<KonvaRect>,
  deltaX?: number
) => {
  useEffect(() => {
    const layer = layerRef.current!;
    const oldX = layer.x();

    // TODO fix
    const minX = -(scrollableWidth - visibleWidth) + startX;
    const maxX = 0 + startX;
    const availableWidth = visibleWidth - PADDING * 2 - SCROLLBAR_HEIGHT;

    const x = Math.max(minX, Math.min(oldX - (deltaX ?? 0), maxX));

    if (deltaX != undefined) layer.x(x);

    const vx = ((x - startX) / (-scrollableWidth + visibleWidth)) * availableWidth + PADDING;

    scrollbarRef.current?.x(vx + startX);
  }, [scrollableWidth]);
};
