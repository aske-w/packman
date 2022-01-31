import React from 'react';
import { Stage, Rect } from 'react-konva';
interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = ({}) => {
  return (
    <div>
      <Stage>
        <Rect width={200} height={200} fill="black"></Rect>
      </Stage>
    </div>
  );
};

export default Canvas;
