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
    console.log({ yyy: y, inputY });

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
          console.log({ thisheigt: this.height(), posY: pos.y, gameHeight });

          console.log({ y });

          pos.x = x;
          pos.y = Math.max(Math.min(pos.y, gameHeight - this.height() - PADDING), PADDING);
          return pos;
        }}
        // onDragMove={function (this: Konva.Layer, e) {
        //   const verticalBar = e.target;
        //   // delta in %
        //   const availableHeight = gameHeight - PADDING * 2 - verticalBar.height();
        //   var delta = (verticalBar.y() - PADDING) / availableHeight;

        //   const newY = -(scrollableHeight - gameHeight) * delta;
        //   onYChanged(newY);
        // }}
      />
    );
  }
);

export default ScrollBar;
