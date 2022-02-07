import Konva from 'konva';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  KonvaNodeEvents,
  Label,
  Layer,
  Rect,
  Stage,
  Tag,
  Text,
} from 'react-konva';
import { Dimensions } from '../types/Dimensions.interface';
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

  const stageRef = useRef<KonvaStage>(null);
  const [tooltip, setTooltip] = useState<Partial<TextConfig>>({
    text: '',
    x: 0,
    y: 0,
    visible: false,
  });
  const enableTooltip = (rect: Rectangle) => {
    var mousePos = stageRef.current?.getPointerPosition();
    if (!mousePos) return;
    setTooltip({
      text: `Width: ${rect.width}, height: ${rect.height}`,
      x: mousePos.x,
      y: mousePos.y,
      visible: true,
    });
  };
  const disableTooltip = () => {
    setTooltip({
      visible: false,
    });
  };
  return (
    <div
      className="flex w-full h-full bg-white "
      style={{
        width: size.width + 'px',
        height: size.height + 'px',
      }}>
      <Stage ref={stageRef} width={size.width} height={size.height}>
        <Layer>
          {rects.map((rect, i) => {
            return (
              <MyRect
                onMouseMove={() => enableTooltip(rect)}
                onMouseOut={() => disableTooltip()}
                key={i}
                {...rect}
                y={rect.y + size.height}
                fill={rect.color}></MyRect>
            );
          })}
        </Layer>
        <Layer>
          <Label
            {...{
              x: tooltip.x,
              y: tooltip.y,
              visible: tooltip.visible,
            }}>
            <Tag
              {...{
                fill: 'black',
                pointerDirection: 'down',
                pointerWidth: 10,
                pointerHeight: 10,
                lineJoin: 'round',
                shadowColor: 'black',
                cornerRadius: 10,
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.5,
              }}
            />
            <Text
              {...{
                fontFamily: 'Arial',
                fontSize: 12,
                padding: 5,
                fill: 'white',
                text: tooltip.text,
              }}></Text>
          </Label>
        </Layer>
      </Stage>
    </div>
  );
});

const MyRect: React.FC<RectConfig & KonvaNodeEvents> = ({ x, y, ...props }) => {
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
