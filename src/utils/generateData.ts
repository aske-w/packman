import Konva from "konva";
import { ColorRect } from "./../types/ColorRect.interface";
import { genId, PADDING } from "../config/canvasConfig";
import { Dimensions } from "../types/Dimensions.interface";

export const generateData = (
  amount = 10,
  max = 100,
  min = 50
): Dimensions[] => {
  return Array.from({ length: amount }, (_, _i) => {
    return {
      width: Math.round(Math.max(Math.random() * max, min)),
      height: Math.round(Math.max(Math.random() * max, min)),
    };
  });
};

export const generateInventory = (inventorySize: number) => {
  return generateData(40).reduce<{
    rects: ColorRect[];
    row: {
      y: number;
      prevRowHeight: number;
    };
  }>(
    (acc, attrs, i) => {
      const { height, width } = attrs;

      acc.row.prevRowHeight = Math.max(
        acc.row.y + height,
        acc.row.prevRowHeight
      );

      const rect = {
        width,
        height,
        x: PADDING,
        y: PADDING,
        fill: Konva.Util.getRandomColor(),
        name: genId(),
      };
      if (i === 0) {
        acc.rects.push(rect);
      } else {
        const prev = acc.rects[i - 1];
        const x = PADDING + prev.x + prev.width;
        if (x + width >= inventorySize) {
          // should create new row
          acc.row.y = acc.row.prevRowHeight + PADDING;
          rect.y = acc.row.prevRowHeight + PADDING * 2;
          rect.x = PADDING;
        } else {
          // continue in row
          rect.y = acc.row.y + PADDING;
          rect.x = x;
        }

        acc.rects.push(rect);
      }

      return acc;
    },
    { rects: [], row: { prevRowHeight: 0, y: 0 } }
  ).rects;
};
