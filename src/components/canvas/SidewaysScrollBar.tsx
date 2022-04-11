import React, { forwardRef } from 'react';
import { Rect } from 'react-konva';
import { GAME_HEIGHT, GAME_WIDTH, PADDING, SCROLLBAR_HEIGHT, SCROLLBAR_WIDTH } from '../../config/canvasConfig';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import Konva from 'konva';

interface SidewaysScrollBarProps {
  scrollableWidth: number;
  onXChanged: (y: number) => void;
  x?: number;
  y: number;
  gameWidth?: number;
  startPosition?: 'left' | 'right';
}

const SidewaysScrollBar = forwardRef<KonvaRect, SidewaysScrollBarProps>(
  ({ scrollableWidth, onXChanged, x: inputX, y, gameWidth = GAME_WIDTH, startPosition = 'left' }, ref) => {
    const x = inputX ?? (startPosition === 'left' ? 0 + PADDING * 2 : gameWidth * 2 - PADDING - SCROLLBAR_WIDTH);
    const startX = inputX ?? 0;

    return (
      <Rect
        ref={ref}
        height={SCROLLBAR_WIDTH}
        width={SCROLLBAR_HEIGHT}
        fill="grey"
        opacity={0.8}
        x={x}
        y={y}
        draggable
        cornerRadius={5}
        dragBoundFunc={function (pos) {
          pos.y = y;
          pos.x = Math.max(Math.min(pos.x, startX + gameWidth - this.width() - PADDING - PADDING), startX + PADDING);
          
          return pos;
        }}
        onDragMove={function (this: Konva.Layer, e) {
          const horizontalBar = e.target;
          // delta in %
          const availableWidth = gameWidth - PADDING * 2 - horizontalBar.width();
          var delta = (horizontalBar.x() - PADDING - startX) / availableWidth;

          const newX = -(scrollableWidth - gameWidth) * delta;
          
          onXChanged(newX);
        }}
      />
    );
  }
);

export default SidewaysScrollBar;
