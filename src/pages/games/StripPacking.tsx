import Konva from "konva";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { Stage as KonvaStage } from "konva/lib/Stage";

import { KonvaEventObject } from "konva/lib/Node";
import { RectConfig, Rect as KonvaRect } from "konva/lib/shapes/Rect";
import React, { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { genData } from "../../components/Actions";
import { Dimensions } from "../../types/Dimensions.interface";
import { Rectangle } from "../../types/Rectangle.interface";
import { clamp, resolveCollision } from "../../utils/konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Group } from "konva/lib/Group";

interface StripPackingProps {}

const windowHeight = window.innerHeight;
const GAME_HEIGHT = windowHeight * 0.8;
console.log({ gameHeight: GAME_HEIGHT });

const inventorySize: Rectangle = {
  height: GAME_HEIGHT,
  width: 200,
  x: 0,
  y: 0,
};
const stripSize: Rectangle = {
  height: GAME_HEIGHT,
  width: 500,
  x: inventorySize.width,
  y: 0,
};

const stageSize: Dimensions = {
  width: stripSize.width + inventorySize.width,
  height: Math.max(stripSize.height, inventorySize.height),
};
type ColorRect = Rectangle & { fill: string; name: string };

const genId = () => Math.floor(1000 + 9000000 * Math.random()).toString();
const SCROLLBAR_HEIGHT = 100;
const SCROLLBAR_WIDTH = 10;
const PADDING = 5;
const SCROLLABLE_HEIGHT = GAME_HEIGHT * 1.5;
const GAME_WIDTH = stageSize.width;
const NUM_RECTS = 50;
const StripPacking: React.FC<StripPackingProps> = ({}) => {
  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const [inventoryRects, setInventoryRects] = useState(
    genData(NUM_RECTS).reduce<ColorRect[]>((acc, { width, height }, i) => {
      if (i === 0) {
        acc.push({
          width,
          height,
          x: PADDING,
          y: -height - PADDING,
          fill: Konva.Util.getRandomColor(),
          name: genId(),
        });
      } else {
        const prev = acc[i - 1];
        const lastHalf = i > NUM_RECTS / 2;
        const resetter = i === NUM_RECTS / 2 
        acc.push({
          width,
          height,
          x: PADDING + (lastHalf ? inventorySize.width / 2 + PADDING : 0),
          y: (resetter ? 0 :prev.y) - height - PADDING,
          fill: Konva.Util.getRandomColor(),
          name: genId(),
        });
      }
      return acc;
    }, [])
  );
  console.log(inventoryRects);
  console.log(stripRects);

  const intersectsBoundary = (x: number, width: number) => {
    if (x > inventorySize.width) {
      return false;
    } else {
      return x + width > inventorySize.width;
    }
  };

  const handleInventoryDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;

    const { fill, name, x, y, width, height } = rect.getAttrs();

    console.log("intersects boundary: " + intersectsBoundary(x, width));

    const inStripArea = x + width >= inventorySize.width;

    if (inStripArea) {
      setInventoryRects((old) => old.filter((r) => r.name !== name));
      const scrollOffset = inventoryLayer.current?.y()!;
      setStripRects((prev) => [
        ...prev,
        {
          fill,
          name,
          height,
          width,
          y: y - stripSize.height + scrollOffset,
          x: x - inventorySize.width,
        },
      ]);
    }
  };

  const handleStripDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;
    const { fill, name, width, height, y } = rect.getAttrs();
    const { x } = rect.getAbsolutePosition();

    const inInventoryArea = x < inventorySize.width;

    if (inInventoryArea) {
      setStripRects((old) => old.filter((r) => r.name !== name));
      const scrollOffset = inventoryLayer.current?.y()!;
      setInventoryRects((prev) => [
        ...prev,
        {
          fill,
          name,
          height,
          width,
          y: y - SCROLLABLE_HEIGHT - scrollOffset,
          x: x,
        },
      ]);
    }
  };

  const inventoryLayer = useRef<KonvaLayer>(null);
  const stripLayer = useRef<KonvaLayer>(null);
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target;
    const targetRect = e.target.getClientRect();

    const checkIntersection = function (group: Group | Shape<ShapeConfig>) {
      // do not check intersection with itself
      if (group === target) {
        return;
      }
      const rect = group.getClientRect();

      if (Konva.Util.haveIntersection(targetRect, rect)) {
        let { x, y } = resolveCollision(targetRect, rect);
        target.setAbsolutePosition({ x, y });
      }
    };

    inventoryLayer.current?.children?.forEach(checkIntersection);
    stripLayer.current?.children?.forEach(checkIntersection);

    const { x, y } = target.getAbsolutePosition();

    target.setAbsolutePosition({
      x: clamp(x, 0, GAME_WIDTH - target.width()),
      y: clamp(y, 0, GAME_HEIGHT - target.height()),
    });
  };

  const handleStageDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target;
    const canvasRect = e.currentTarget.getClientRect();
    const targetRect = e.target.getClientRect();
  };

  const verticalBar = useRef<KonvaRect>(null);
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    const isOutsideInventory = e.evt.x > inventorySize.width;
    if (isOutsideInventory) return;
    e.evt.preventDefault();

    const layer = inventoryLayer.current!;

    const dy = e.evt.deltaY;
    const oldY = layer.y();

    const minY = -(SCROLLABLE_HEIGHT - GAME_HEIGHT);
    const maxY = 0;

    const y = Math.max(minY, Math.min(oldY - dy, maxY));

    layer.y(y);

    const stageHeight = GAME_HEIGHT;
    const availableHeight = stageHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

    const vy =
      (y / (-SCROLLABLE_HEIGHT + stageHeight)) * availableHeight + PADDING;

    verticalBar.current?.y(vy);
  };

  return (
    <div className="h-full p-10">
      <div className="w-1/2">
        <div className="flex flex-col w-1/2 px-2 mb-4 font-bold bg-white">
          <span>Total height: 0</span>
          <span>Rectangles left: {inventoryRects.length}</span>
        </div>
        <Stage
          onWheel={handleWheel}
          {...stageSize}
          onDragMove={handleStageDragMove}
        >
          <Layer>
            <Rect fill="#ffffff" {...stripSize} />
            <Rect fill="#eee000" {...inventorySize} />
            <Rect
              ref={verticalBar}
              width={SCROLLBAR_WIDTH}
              height={SCROLLBAR_HEIGHT}
              fill="grey"
              opacity={0.8}
              x={inventorySize.width - PADDING - SCROLLBAR_WIDTH}
              y={5}
              draggable
              cornerRadius={5}
              dragBoundFunc={function (pos) {
                pos.x = inventorySize.width - PADDING - SCROLLBAR_WIDTH;
                pos.y = Math.max(
                  Math.min(
                    pos.y,
                    inventorySize.height - this.height() - PADDING
                  ),
                  PADDING
                );
                return pos;
              }}
              onDragMove={function (this: Konva.Layer, e) {
                const verticalBar = e.target;
                // delta in %
                const availableHeight =
                  inventorySize.height - PADDING * 2 - verticalBar.height();
                var delta = (verticalBar.y() - PADDING) / availableHeight;

                const newY =
                  -(SCROLLABLE_HEIGHT - inventorySize.height) * delta;
                console.log({ newY, delta });
                inventoryLayer.current?.y(newY);
              }}
            />
          </Layer>
          {/* Rect input layer */}
          <Layer
            {...stripSize}
            ref={stripLayer}
            /*onDragEnd={handleStripDragEnd}*/
          >
            {stripRects.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  draggable
                  strokeWidth={2}
                  stroke="red"
                  y={stripSize.height + r.y}
                  onDragEnd={handleStripDragEnd}
                  onDragMove={handleDragMove}
                  id={`STRIP_RECT`}
                />
              );
            })}
          </Layer>
          <Layer
            {...inventorySize}
            height={inventorySize.height}
            x={0}
            ref={inventoryLayer}
            name="INVENTORY_LAYER"
          >
            {inventoryRects.map((r, i) => {
              const inStripArea = r.x + r.width >= inventorySize.width;
              return (
                <Rect
                  key={r.name}
                  {...r}
                  onDragMove={handleDragMove}
                  draggable
                  strokeWidth={2}
                  stroke={"#002050FF"}
                  y={SCROLLABLE_HEIGHT + r.y}
                  onDragEnd={handleInventoryDragEnd}
                  id={`INVENTORY_RECT`}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default StripPacking;

const onDragMove = function (this: Konva.Layer, e: any) {
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
};
