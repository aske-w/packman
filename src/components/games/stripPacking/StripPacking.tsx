import Konva from "konva";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { Stage as KonvaStage } from "konva/lib/Stage";

import { KonvaEventObject } from "konva/lib/Node";
import { RectConfig, Rect as KonvaRect } from "konva/lib/shapes/Rect";
import React, { useMemo, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { genData } from "../../Actions";
import { Dimensions } from "../../../types/Dimensions.interface";
import { Rectangle } from "../../../types/Rectangle.interface";
import { clamp, resolveCollision } from "../../../utils/konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Group } from "konva/lib/Group";
import {
  CanvasProps,
  GAME_HEIGHT,
  GAME_WIDTH,
  INVENTORY_SIZE,
  NUM_RECTS,
  STRIP_SIZE,
} from "../../../config/canvasConfig";
import { ColorRect } from "../../../types/ColorRect.interface";

interface StripPackingProps extends CanvasProps {
  onDragDrop(): void;
}

type KonvaWheelEvent = {
  evt: {
    layerX: number;
    layerY: number;
  };
};

console.log({ gameHeight: GAME_HEIGHT });

const stageSize: Dimensions = {
  width: STRIP_SIZE.width + INVENTORY_SIZE.width,
  height: Math.max(STRIP_SIZE.height, INVENTORY_SIZE.height),
};

const SCROLLBAR_HEIGHT = 100;
const SCROLLBAR_WIDTH = 10;
const PADDING = 5;

const StripPacking: React.FC<StripPackingProps> = ({ input, onDragDrop }) => {
  const scrollableInventoryHeight = useMemo(
    () => input.reduce((height, r) => height + r.height + PADDING, 0),
    [input]
  );

  const scrollableStripHeight = 10000;

  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const [inventoryRects, setInventoryRects] = useState(() => {
    return input.reduce<ColorRect[]>((acc, attrs, i) => {
      const { height, width } = attrs;
      const x = INVENTORY_SIZE.width / 2 - width / 2;
      if (i === 0) {
        acc.push({
          ...attrs,
          x,
          y: -height - PADDING,
        });
      } else {
        const prev = acc[i - 1];
        acc.push({
          ...attrs,
          x,
          y: prev.y - height - PADDING,
        });
      }
      return acc;
    }, []);
  });

  console.log(inventoryRects);
  console.log(stripRects);

  const intersectsBoundary = (x: number, width: number) => {
    if (x > INVENTORY_SIZE.width) {
      return false;
    } else {
      return x + width > INVENTORY_SIZE.width;
    }
  };

  const totalHeight = useMemo(() => {
    return stripRects.reduce((maxY, r) => Math.max(maxY, -1 * r.y), 0);
  }, [stripRects]);
  // const [totalHeight, setTotalHeight] = useState(0);

  const handleInventoryDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;

    const { fill, name, x, y, width, height } = rect.getAttrs();

    console.log("intersects boundary: " + intersectsBoundary(x, width));

    const inStripArea = x + width >= INVENTORY_SIZE.width;

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
          y: y - STRIP_SIZE.height + scrollOffset,
          x: x - INVENTORY_SIZE.width,
        },
      ]);
      // // timeout to flush the state before we update height
      // setTimeout(() => {
      //   setTotalHeight(calcTotalHeight(stripRects));
      // }, 0);

      onDragDrop();
    }
  };

  const handleStripDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;
    const { fill, name, width, height, y } = rect.getAttrs();
    const { x, y: absY } = rect.getAbsolutePosition();

    const inInventoryArea = x < INVENTORY_SIZE.width;

    const scrollOffset = inventoryLayer.current?.y()!;
    if (inInventoryArea) {
      // move to other list of rectangles
      setStripRects((old) => old.filter((r) => r.name !== name));
      setInventoryRects((prev) => [
        ...prev,
        {
          fill,
          name,
          height,
          width,
          y: y - scrollableInventoryHeight - scrollOffset,
          x: x,
        },
      ]);
    } else {
      setStripRects((old) => {
        const tmp = [...old];
        const idx = tmp.findIndex((r) => r.name === name);
        if (idx === -1) return old;
        tmp[idx].x = x - INVENTORY_SIZE.width;
        tmp[idx].y = absY - GAME_HEIGHT;
        return tmp;
      });
    }
    // // timeout to flush the state before we update height
    // setTimeout(() => {
    //   setTotalHeight(calcTotalHeight(stripRects));
    // }, 0);
  };

  const inventoryLayer = useRef<KonvaLayer>(null);
  const stripLayer = useRef<KonvaLayer>(null);

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target as Shape;
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

  const inventoryVerticalBar = useRef<KonvaRect>(null);
  const stripVerticalBar = useRef<KonvaRect>(null);
  const handleWheel = (e: KonvaEventObject<WheelEvent> & KonvaWheelEvent) => {
    e.evt.preventDefault();
    const isOutsideInventory = e.evt.layerX > INVENTORY_SIZE.width;

    if (isOutsideInventory) {
      const layer = stripLayer.current!;
      const dy = e.evt.deltaY;
      const oldY = layer.y();

      const minY = -(scrollableStripHeight - GAME_HEIGHT);
      const maxY = 0;

      const y = Math.max(minY, Math.min(oldY - dy, maxY));

      layer.y(y);

      const stageHeight = GAME_HEIGHT;
      const availableHeight = stageHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

      const vy =
        (y / (-scrollableStripHeight + stageHeight)) * availableHeight +
        PADDING;

      stripVerticalBar.current?.y(vy);

      return;
    }

    const layer = inventoryLayer.current!;

    const dy = e.evt.deltaY;
    const oldY = layer.y();

    const minY = -(scrollableInventoryHeight - GAME_HEIGHT);
    const maxY = 0;

    const y = Math.max(minY, Math.min(oldY - dy, maxY));

    layer.y(y);

    const stageHeight = GAME_HEIGHT;
    const availableHeight = stageHeight - PADDING * 2 - SCROLLBAR_HEIGHT;

    const vy =
      (y / (-scrollableInventoryHeight + stageHeight)) * availableHeight +
      PADDING;

    inventoryVerticalBar.current?.y(vy);
  };

  return (
    <div className="h-full w-[700px] p-10">
      {/* <div className="w-1/2"> */}
      <div className="flex flex-col w-1/2 px-2 mb-4 font-bold bg-white">
        <span>Total height: {totalHeight}</span>
        <span>Rectangles left: {inventoryRects.length}</span>
      </div>
      <Stage onWheel={handleWheel} {...stageSize}>
        <Layer>
          <Rect fill="#ffffff" {...STRIP_SIZE} />
          <Rect fill="#eee000" {...INVENTORY_SIZE} />
          <Rect
            ref={inventoryVerticalBar}
            width={SCROLLBAR_WIDTH}
            height={SCROLLBAR_HEIGHT}
            fill="grey"
            opacity={0.8}
            x={INVENTORY_SIZE.width - PADDING - SCROLLBAR_WIDTH}
            y={INVENTORY_SIZE.height - PADDING - SCROLLBAR_HEIGHT}
            draggable
            cornerRadius={5}
            dragBoundFunc={function (pos) {
              pos.x = INVENTORY_SIZE.width - PADDING - SCROLLBAR_WIDTH;
              pos.y = Math.max(
                Math.min(
                  pos.y,
                  INVENTORY_SIZE.height - this.height() - PADDING
                ),
                PADDING
              );
              return pos;
            }}
            onDragMove={function (this: Konva.Layer, e) {
              const verticalBar = e.target;
              // delta in %
              const availableHeight =
                INVENTORY_SIZE.height - PADDING * 2 - verticalBar.height();
              var delta = (verticalBar.y() - PADDING) / availableHeight;

              const newY =
                -(scrollableInventoryHeight - INVENTORY_SIZE.height) * delta;
              console.log({ newY, delta });

              inventoryLayer.current?.y(newY);
            }}
          />
          <Rect
            ref={stripVerticalBar}
            width={SCROLLBAR_WIDTH}
            height={SCROLLBAR_HEIGHT}
            fill="grey"
            opacity={0.8}
            x={GAME_WIDTH - PADDING - SCROLLBAR_WIDTH}
            y={GAME_HEIGHT}
            draggable
            cornerRadius={5}
            dragBoundFunc={function (pos) {
              pos.x = GAME_WIDTH - PADDING - SCROLLBAR_WIDTH;
              pos.y = Math.max(
                Math.min(pos.y, GAME_HEIGHT - this.height() - PADDING),
                PADDING
              );
              return pos;
            }}
            onDragMove={function (this: Konva.Layer, e) {
              const verticalBar = e.target;
              // delta in %
              const availableHeight =
                GAME_HEIGHT - PADDING * 2 - verticalBar.height();
              var delta = (verticalBar.y() - PADDING) / availableHeight;

              const newY = -(scrollableStripHeight - GAME_HEIGHT) * delta;
              console.log({ newY, delta });
              stripLayer.current?.y(newY);
            }}
          />
        </Layer>
        {/* Rect input layer */}
        <Layer
          {...STRIP_SIZE}
          y={-(scrollableStripHeight - STRIP_SIZE.height)}
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
                y={STRIP_SIZE.height + r.y}
                onDragEnd={handleStripDragEnd}
                onDragMove={handleDragMove}
                id={`STRIP_RECT`}
              />
            );
          })}
        </Layer>
        <Layer
          {...INVENTORY_SIZE}
          height={INVENTORY_SIZE.height}
          x={0}
          y={-(scrollableInventoryHeight - INVENTORY_SIZE.height)}
          ref={inventoryLayer}
          name="INVENTORY_LAYER"
        >
          {inventoryRects.map((r, i) => {
            const inStripArea = r.x + r.width >= INVENTORY_SIZE.width;
            return (
              <Rect
                key={r.name}
                {...r}
                onDragMove={handleDragMove}
                draggable
                strokeWidth={2}
                stroke={"#002050FF"}
                y={scrollableInventoryHeight + r.y}
                onDragEnd={handleInventoryDragEnd}
                id={`INVENTORY_RECT`}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
    // </div>
  );
};

export default StripPacking;
