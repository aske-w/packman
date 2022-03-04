import { Dimensions } from '../../types/Dimensions.interface';
import { Rectangle } from '../../types/Rectangle.interface';

export const GameSize: Dimensions = {
  width: 500,
  height: 100,
};

export const TestData: Dimensions[] = [
  {
    width: 200,
    height: 200,
  },
  { width: 301, height: 180 },
  { width: 120, height: 160 },
  { width: 199, height: 160 },
  { width: 60, height: 150 },
];

export const ExpectedData: Rectangle[] = [
  {
    width: 200,
    height: 200,
    x: 0,
    y: -200,
  },
  { width: 301, height: 180, x: 0, y: -380 },
  { width: 120, height: 160, x: 301, y: -360 },
  { width: 199, height: 160, x: 200, y: -160 },
  { width: 60, height: 150, x: 421, y: -350 },
];

export const LastShelf = {
  remainingWidth: 19,
  bottomY: -200,
  height: 180,
};
