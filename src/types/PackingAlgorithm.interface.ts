import { Dimensions } from './Dimensions.interface';
import { Rectangle } from './Rectangle.interface';

export interface PackingAlgorithm {
  gameSize: Dimensions;
  load(data: Dimensions[]): PackingAlgorithm;
  next(): Dimensions;
  place(): Rectangle;
  isFinished(): boolean;
}

export enum PackingAlgorithms {
  NEXT_FIT_DECREASING_HEIGHT = 'Next Fit Decreasing Height',
  FIRST_FIT_DECREASING_HEIGHT = 'First Fit Decreasing Height',
  BEST_FIT_DECREASING_HEIGHT = 'Best Fit Decreasing Height',
}

export const ALL_PACKING_ALGORITHMS = [
  PackingAlgorithms.FIRST_FIT_DECREASING_HEIGHT,
  PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT,
  PackingAlgorithms.BEST_FIT_DECREASING_HEIGHT,
];
