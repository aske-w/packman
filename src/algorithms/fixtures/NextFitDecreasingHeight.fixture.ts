import { Dimensions } from '../../types/Dimensions.interface';
import { Rectangle } from '../../types/Rectangle.interface';

export const GameSize: Dimensions = {
  width: 500,
  height: 100,
};

export const TestData: Dimensions[] = [
  {
    width: 100,
    height: 200,
  },
  { width: 200, height: 180 },
  { width: 120, height: 160 },
  { width: 120, height: 160 },
];

export const ExpectedData: Rectangle[] = [
  {
    width: 100,
    height: 200,
    x: 0,
    y: -200,
  },
  { width: 200, height: 180, x: 100, y: -180 },
  { width: 120, height: 160, x: 300, y: -160 },
  { width: 120, height: 160, x: 0, y: -360 },
];
