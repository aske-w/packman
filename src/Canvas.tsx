import Konva from 'konva';
import React, { useState } from 'react';
import { Stage, Rect, Layer } from 'react-konva';
import { Dimensions } from './types/Dimensions.interface';
interface CanvasProps {}
const gameSize: Dimensions = {
  width: 400,
  height: 800,
};

const Canvas: React.FC<CanvasProps> = ({}) => {
  const [data] = useState(genData(100));
  return (
    <div
      className=" flex w-full h-full bg-white"
      style={{
        width: gameSize.width + 'px',
        height: gameSize.height + 'px',
      }}>
      <Stage width={gameSize.width} height={gameSize.height}>
        <Layer>
          {data.map((rect, i) => {
            return (
              <Rect
                key={i}
                {...rect}
                x={gameSize.width * Math.random()}
                y={gameSize.height * Math.random()}
                fill="black"
                draggable></Rect>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

const genData = (amount = 10): Dimensions[] => {
  return Array.from({ length: amount }, (_, _i) => {
    return {
      width: Math.round(Math.random() * 100),
      height: Math.round(Math.random() * 100),
    };
  });
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export default Canvas;
