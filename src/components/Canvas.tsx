import Konva from 'konva';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Stage, Rect, Layer } from 'react-konva';
import { Dimensions } from '../algorithms/Dimensions.interface';
import { genData } from '../App';
import { Rectangle } from '../types/Rectangle.interface';
interface CanvasProps {
  size: Dimensions;
}

export interface CanvasHandle {
  place: (rect: Rectangle) => void;
  reset: () => void;
}
type WithColor<T> = T & { color: string };

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ size }, handle) => {
  const [rects, setRects] = useState<WithColor<Rectangle>[]>([]);
  console.log(rects);

  useImperativeHandle(
    handle,
    () => ({
      place: rect => {
        setRects(old => [
          ...old,
          { ...rect, color: Konva.Util.getRandomColor() },
        ]);
      },
      reset: () => setRects([]),
    }),
    []
  );

  return (
    <div
      className="flex w-full h-full bg-white "
      style={{
        width: size.width + 'px',
        height: size.height + 'px',
      }}>
      <Stage width={size.width} height={size.height}>
        <Layer>
          {rects.map((rect, i) => {
            return (
              <Rect
                key={i}
                {...rect}
                y={rect.y + size.height}
                fill={rect.color}></Rect>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export default Canvas;
