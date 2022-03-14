import Konva from "konva";
import { ColorRect } from "./../types/ColorRect.interface";
import { genId, PADDING } from "../config/canvasConfig";
import { Dimensions } from "../types/Dimensions.interface";
import { RectangleConfig } from "../types/RectangleConfig.interface";

interface Acc<T = {}> {
  rects: ColorRect<T>[];
  row: { prevRowHeight: number; y: number };
}

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

export const generateInventory = (inventorySize: number, numItems = 50) => {
  return generateData(numItems, 200, 25).reduce<Acc>(
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

export const compressInventory = (
  rects: ColorRect<
    RectangleConfig & {
      order?: number | undefined;
    }
  >[],
  inventorySize: number
) => {
  return rects
    .sort((a) => (a.order === undefined ? 1 : 0))
    .reduce<
      Acc<
        RectangleConfig & {
          order?: number | undefined;
        }
      >
    >(
      (acc, rect, i) => {
        const { height, width } = rect;

        acc.row.prevRowHeight = Math.max(
          acc.row.y + height,
          acc.row.prevRowHeight
        );

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
