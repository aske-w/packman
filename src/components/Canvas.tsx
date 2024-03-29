import Konva from 'konva';
import { Rect as KonvaRect, RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { KonvaNodeEvents, Label, Layer, Rect, Stage, Tag, Text } from 'react-konva';
import usePlaygroundStore from '../store/playground.store';
import { Rectangle } from '../types/Rectangle.interface';
import { resolveCollision } from '../utils/konva';
import Card from './Card';
interface CanvasProps {
  width: number;
  rects: WithColor<Rectangle>[];
}

export interface CanvasHandle {}
export type WithColor<T> = T & { color: string };

const HEIGHT = 5000;

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ width, rects }, handle) => {
  const stageRef = useRef<KonvaStage>(null);
  const { animateRects } = usePlaygroundStore(useCallback(({ animateRects }) => ({ animateRects }), []));
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

  const setBottomRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      node.scrollIntoView();
    }
  }, []);

  return (
    <Card
      className="flex flex-col h-full overflow-y-scroll bg-white"
      style={{
        height: window.innerHeight * 0.9 + 'px',
      }}
    >
      <Stage ref={stageRef} width={width} height={HEIGHT}>
        <Layer
          onDragMove={function (this: Konva.Layer, e) {
            const target = e.target;
            const targetRect = e.target.getClientRect();

            const layer = this;

            layer.children?.forEach(function (group) {
              // do not check intersection with itself
              if (group === target) {
                return;
              }
              const rect = group.getClientRect();

              if (Konva.Util.haveIntersection(targetRect, rect)) {
                const { x, y } = resolveCollision(targetRect, rect);
                target.setPosition({ x, y });
              }
            });
          }}
        >
          {rects.map((rect, i) => {
            return (
              <MyRect
                animateRect={animateRects}
                key={i}
                onMouseMove={() => enableTooltip(rect)}
                onMouseOut={() => disableTooltip()}
                {...rect}
                y={rect.y + HEIGHT}
                fill={rect.color}
              />
            );
          })}
        </Layer>
        <Layer>
          <Label x={tooltip.x ?? 0} y={tooltip.y ?? 0} visible={tooltip.visible}>
            <Tag
              fill={'black'}
              pointerDirection={getTooltipPos(tooltip.x!)}
              pointerWidth={10}
              pointerHeight={10}
              lineJoin={'round'}
              shadowColor={'black'}
              cornerRadius={10}
              shadowBlur={10}
              shadowOffsetX={10}
              shadowOffsetY={10}
              shadowOpacity={0.5}
            />
            <Text fontFamily={'Arial'} fontSize={12} padding={5} fill={'white'} text={tooltip.text} />
          </Label>
        </Layer>
      </Stage>
      <div ref={setBottomRef} />
    </Card>
  );
});

const MyRect: React.FC<RectConfig & KonvaNodeEvents & { animateRect: boolean }> = ({ x, y, animateRect, ...props }) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    if (!animateRect) return;

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
  }, [x, y, animateRect]);

  return (
    <Rect
      ref={ref}
      x={animateRect ? 0 : x}
      y={animateRect ? 800 : y}
      opacity={animateRect ? 0 : 1}
      stroke={'rgba(0,0,0,0.2)'}
      strokeWidth={1}
      scaleX={animateRect ? 3 : 1}
      scaleY={animateRect ? 3 : 1}
      rotation={animateRect ? 45 : 0}
      {...props}
    />
  );
};

export default Canvas;
