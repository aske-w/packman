import Konva from "konva";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { KonvaEventObject } from "konva/lib/Node";
import { RectConfig } from "konva/lib/shapes/Rect";
import React, { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { genData } from "../../components/Actions";
import { Dimensions } from "../../types/Dimensions.interface";
import { Rectangle } from "../../types/Rectangle.interface";
import { resolveCollision } from "../../utils/konva";

interface StripPackingProps {}

const windowHeight = window.innerHeight;
const gameHeight = windowHeight * 0.8;
console.log({ gameHeight });

const inventorySize: Rectangle = {
  height: gameHeight,
  width: 200,
  x: 0,
  y: 0,
};
const stripSize: Rectangle = {
  height: gameHeight,
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

const StripPacking: React.FC<StripPackingProps> = ({}) => {
  const [stripRects, setStripRects] = useState<ColorRect[]>([]);
  const [rectangles, setRectangles] = useState(
    genData(10).reduce<ColorRect[]>((acc, { width, height }, i) => {
      if (i === 0) {
        acc.push({
          width,
          height,
          x: 0,
          y: -height,
          fill: Konva.Util.getRandomColor(),
          name: genId(),
        });
      } else {
        const prev = acc[i - 1];

        acc.push({
          width,
          height,
          x: 0,
          y: prev.y - height,
          fill: Konva.Util.getRandomColor(),
          name: genId(),
        });
      }
      return acc;
    }, [])
  );
  console.log(rectangles);
  console.log(stripRects);

  const intersectsBoundary = (x: number, width: number) => {
    if (x > inventorySize.width) {
      return false;
    } else {
      return x + width > inventorySize.width;
    }
  };

  const handleDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;

    const { fill, name, x, y, width, height } = rect.getAttrs();

    console.log("intersects boundary: " + intersectsBoundary(x, width));

    const inStripArea = x + width >= inventorySize.width;

    console.log({ name });

    setRectangles((old) => {
      const cpy = [...old];
      const idx = cpy.findIndex((n) => n.name === name);
      cpy.splice(idx, 1, {
        fill,
        name,
        height,
        width,
        y: y - stripSize.height,
        x: x,
      });
      return cpy;
    });
  };

  const handleStripDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;
    console.log(rect);

    const { fill, name, x, y, width, height } = rect.getAttrs();

    console.log({ fill, name, x, y, width, height });
    console.log("intersects boundary: " + intersectsBoundary(x, width));

    const inInventoryArea = x < 0;

    if (inInventoryArea) {
      setStripRects((old) => old.filter((r) => r.name !== name));

      setRectangles((prev) => [
        ...prev,
        {
          fill,
          name,
          height,
          width,
          y: y - stripSize.height,
          x: x,
        },
      ]);
    }
  };

  const stripLayer = useRef<KonvaLayer>(null);
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target;
    const targetRect = e.target.getClientRect();

    stripLayer.current?.children?.forEach(function (group) {
      // do not check intersection with itself
      if (group === target) {
        return;
      }
      const rect = group.getClientRect();

      if (Konva.Util.haveIntersection(targetRect, rect)) {
        const { x, y } = resolveCollision(targetRect, rect);
        target.setAbsolutePosition({ x, y });
      }
    });
  };

  const handleStageDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target;
    const canvasRect = e.currentTarget.getClientRect();
    const targetRect = e.target.getClientRect();

    if (Konva.Util.haveIntersection(canvasRect, targetRect)) {
      const { x, y } = resolveCollision(canvasRect, targetRect);
      target.setAbsolutePosition({ x, y });
    }
  };

  return (
    <div className="h-full p-10">
      <div className="w-1/2">
        <div className="flex flex-col w-1/2 px-2 mb-4 font-bold bg-white pmb-4">
          <span>Total height: 0</span>
          <span>Rectangles left: {rectangles.length}</span>
        </div>
        <Stage {...stageSize} onDragMove={handleStageDragMove}>
          <Layer>
            <Rect fill="#ffffff" {...stripSize} />
            <Rect fill="#eee000" {...inventorySize} />
          </Layer>
          {/* Rect input layer */}
          {/* <Layer {...stripSize} onDragEnd={handleStripDragEnd}>
            {stripRects.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  draggable
                  strokeWidth={1}
                  stroke="#00205050"
                  y={stripSize.height + r.y}
                  //   onDragEnd={handleStageDragEnd}
                  />
                  );
                })}
            </Layer> */}
          <Layer ref={stripLayer}>
            {rectangles.map((r, i) => {
              const inStripArea = r.x + r.width >= inventorySize.width;
              return (
                <Rect
                  key={r.name}
                  {...r}
                  onDragMove={handleDragMove}
                  draggable
                  strokeWidth={2}
                  stroke={inStripArea ? "#002050FF" : "red"}
                  y={inventorySize.height + r.y}
                  onDragEnd={handleDragEnd}
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
