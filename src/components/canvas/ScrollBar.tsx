import React, { forwardRef } from "react";
import { Rect } from "react-konva";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PADDING,
  SCROLLBAR_HEIGHT,
  SCROLLBAR_WIDTH,
} from "../../config/canvasConfig";
import { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import Konva from "konva";

interface ScrollBarProps {
  scrollableHeight: number;
  onYChanged: (y: number) => void;
  x: number;
  gameHeight?: number;
}

const ScrollBar = forwardRef<KonvaRect, ScrollBarProps>(
  ({ scrollableHeight, onYChanged, x, gameHeight = GAME_HEIGHT }, ref) => {
    return (
      <Rect
        ref={ref}
        width={SCROLLBAR_WIDTH}
        height={SCROLLBAR_HEIGHT}
        fill="grey"
        opacity={0.8}
        x={x}
        y={gameHeight - PADDING - SCROLLBAR_HEIGHT}
        draggable
        cornerRadius={5}
        dragBoundFunc={function (pos) {
          pos.x = x;
          pos.y = Math.max(
            Math.min(pos.y, gameHeight - this.height() - PADDING),
            PADDING
          );
          return pos;
        }}
        onDragMove={function (this: Konva.Layer, e) {
          const verticalBar = e.target;
          // delta in %
          const availableHeight =
            gameHeight - PADDING * 2 - verticalBar.height();
          var delta = (verticalBar.y() - PADDING) / availableHeight;

          const newY = -(scrollableHeight - gameHeight) * delta;
          onYChanged(newY);
        }}
      />
    );
  }
);

export default ScrollBar;
