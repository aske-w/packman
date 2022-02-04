import Konva from 'konva';
import { RectConfig, Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Stage, Rect, Layer, KonvaNodeComponent } from 'react-konva';
import { Dimensions } from '../types/Dimensions.interface';
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
              <MyRect
                key={i}
                {...rect}
                y={rect.y + size.height}
                fill={rect.color}></MyRect>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

const MyRect: React.FC<RectConfig> = ({ x, y, ...props }) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    ref.current?.to({
      x,
      y,
      duration: 0.4,
    });
  }, [x, y]);
  return <Rect ref={ref} x={0} y={800} {...props}></Rect>;
};

export default Canvas;
