import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { RectConfig } from "konva/lib/shapes/Rect";
import React, { useState } from "react";
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
  const [inventory, setInventory] = useState(
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
  console.log(inventory);
  console.log(stripRects);

  const handleStageDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    const rect = evt.target;
    console.log(rect);
    // const box = rect.getClientRect();
    const { fill, name, x, y, width, height } = rect.getAttrs();

    const inStripArea = x + width >= inventorySize.width;

    if (inStripArea) {
      console.log({ name });
      setInventory((old) => old.filter((r) => r.name !== name));

      setStripRects((prev) => [
        ...prev,
        {
          fill,
          name,
          height,
          width,
          y: y - stripSize.height,
          x: x - inventorySize.width,
        },
      ]);
    }
  };

  return (
    <div className="h-full p-10">
      <div className="w-1/2">
        <div className="flex flex-col w-1/2 mb-4 font-bold bg-white">
          <span>Total height: 0</span>
          <span>Rectangles left: 0</span>
        </div>
        <Stage {...stageSize}>
          {/* Rect input layer */}
          <Layer
            {...stripSize}
            onDragStart={function (this: Konva.Layer, e) {
              const childs = this.children ? this.children.length - 1 : 0;

              console.log("Call place for algorithm");
            }}
          >
            <Rect fill="#ffffff" {...stripSize} x={0} />

            {stripRects.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  draggable
                  strokeWidth={2}
                  stroke="black"
                  y={stripSize.height + r.y}
                  //   onDragEnd={handleStageDragEnd}
                />
              );
            })}
          </Layer>
          <Layer {...inventorySize}>
            <Rect fill="#eee000" {...inventorySize} />
            {inventory.map((r, i) => {
              return (
                <Rect
                  key={r.name}
                  {...r}
                  draggable
                  strokeWidth={2}
                  stroke="black"
                  y={inventorySize.height + r.y}
                  onDragEnd={handleStageDragEnd}
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
