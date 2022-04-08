import React, { forwardRef } from 'react';
import { Rect } from 'react-konva';
import { GAME_HEIGHT, PADDING, SCROLLBAR_HEIGHT, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import Konva from 'konva';

interface ScrollBarProps {
  scrollableHeight: number;
  onYChanged: (y: number) => void;
  x: number;
  y?: number;
  gameHeight?: number;
  startPosition?: 'top' | 'bottom';
}

const ScrollBar = forwardRef<KonvaRect, ScrollBarProps>(
  ({ scrollableHeight, onYChanged, y: inputY, x, gameHeight = GAME_HEIGHT, startPosition = 'bottom' }, ref) => {
    const y = inputY ?? (startPosition === 'bottom' ? gameHeight - PADDING - SCROLLBAR_HEIGHT : PADDING);
    const startY = inputY ?? 0;

    return (
      <Rect
        ref={ref}
        width={SCROLLBAR_WIDTH}
        height={SCROLLBAR_HEIGHT}
        fill="grey"
        opacity={0.8}
        x={x}
        y={y}
        draggable
        cornerRadius={5}
        dragBoundFunc={function (pos) {
          pos.x = x;
          pos.y = Math.max(Math.min(pos.y, startY + gameHeight - this.height() - PADDING), startY + PADDING);

          return pos;
        }}
        onDragMove={function (this: Konva.Layer, e) {
          const verticalBar = e.target;
          // delta in %
          const availableHeight = gameHeight - PADDING * 2 - verticalBar.height();
          var delta = (verticalBar.y() - PADDING - startY) / availableHeight;
          
          const newY = -(scrollableHeight - gameHeight) * delta;

          onYChanged(newY);
        }}
      />
    );
  }
);

export default ScrollBar;
