import { DimensionsWithConfig } from "./../types/DimensionsWithConfig.type";
import Konva from "konva";
import { genData } from "../components/Actions";
import { Dimensions } from "../types/Dimensions.interface";
import { Rectangle } from "../types/Rectangle.interface";

export interface CanvasProps {
  scrollableStripHeight: number;
  input: DimensionsWithConfig[];
}

export type KonvaWheelEvent = {
  evt: {
    layerX: number;
    layerY: number;
  };
};

export const SCROLLBAR_HEIGHT = 100;
export const SCROLLBAR_WIDTH = 10;

export const WINDOW_HEIGHT = window.innerHeight;
export const GAME_HEIGHT = WINDOW_HEIGHT * 0.6;
export const PADDING = 5;
export const NUM_RECTS = 50;
export const SCROLLABLE_HEIGHT = GAME_HEIGHT * 1.5;

export const INVENTORY_SIZE: Rectangle = {
  height: GAME_HEIGHT,
  width: 200,
  x: 0,
  y: 0,
};
export const STRIP_SIZE: Rectangle = {
  height: GAME_HEIGHT,
  width: 500,
  x: INVENTORY_SIZE.width,
  y: 0,
};

export const STAGE_SIZE: Dimensions = {
  width: STRIP_SIZE.width + INVENTORY_SIZE.width,
  height: Math.max(STRIP_SIZE.height, INVENTORY_SIZE.height),
};

export const GAME_WIDTH = STAGE_SIZE.width;

export const genId = () =>
  Math.floor(1000 + 9000000 * Math.random()).toString();

export const genInventory = () =>
  genData(NUM_RECTS).map<DimensionsWithConfig>(({ width, height }) => {
    return {
      width,
      height,
      fill: Konva.Util.getRandomColor(),
      name: genId(),
    };
  });
