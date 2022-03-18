import Konva from 'konva';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { IRect } from 'konva/lib/types';
import React, { useEffect, useRef, useState } from 'react';
import { KonvaNodeEvents, Label, Layer, Rect, Stage, Tag, Text } from 'react-konva';
import { ColorRect } from '../../types/ColorRect.interface';

interface BinProps {
  width: number;
  height: number;
  items: ColorRect[];
}

const Bin: React.FC<BinProps> = ({ height, items, width }) => {
  const stageRef = useRef<KonvaStage>(null);
  const [tooltip, setTooltip] = useState<Partial<TextConfig>>({
    text: '',
    x: 0,
    y: 0,
    visible: false,
  });
  const enableTooltip = (rect: IRect) => {
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
  const getTooltipPos = (x: number) => {
    const threshold = 100;
    const closeToLeft = x < threshold;
    const closeToRight = width - x < threshold;
    if (!closeToLeft && !closeToRight) {
      return 'down';
    }
    if (closeToLeft) return 'left';
    if (closeToRight) return 'right';
  };

  return (
    <Stage ref={stageRef} {...{ width, height }}>
      <Layer>
        <Rect {...{ width, height }} fill={'#555'} />
        {items.map(rect => (
          <MyRect key={rect.name} onMouseMove={() => enableTooltip(rect)} onMouseOut={() => disableTooltip()} {...rect} y={rect.y + height} />
        ))}
      </Layer>
      <Layer>
        <Label
          {...{
            x: (tooltip.x || 0) + 10,
            y: (tooltip.y || 0) + 10,
            visible: tooltip.visible,
          }}
        >
          <Tag
            {...{
              fill: 'black',
              pointerDirection: getTooltipPos(tooltip.x!),
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
            }}
          ></Text>
        </Label>
      </Layer>
    </Stage>
  );
};

export default Bin;

const MyRect: React.FC<RectConfig & KonvaNodeEvents> = ({
  x,
  y,

  ...props
}) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    new Konva.Tween({
      node: ref.current!,
      duration: 0.4,
      x,
      y,
      opacity: 1,
      easing: Konva.Easings.StrongEaseInOut,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    }).play();
  }, [x, y]);

  return (
    <Rect
      ref={ref}
      x={0}
      y={800}
      opacity={0}
      stroke={'rgba(0,0,0,0.2)'}
      strokeWidth={1}
      scaleX={3}
      scaleY={3}
      rotation={45}
      draggable
      {...props}
    ></Rect>
  );
};
