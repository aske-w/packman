import { Dimensions } from '../algorithms/Dimensions.interface';
import { Rectangle } from './Rectangle.interface';

export interface PackingAlgorithm {
  gameSize: Dimensions;
  data: Dimensions[];
  load(data: Dimensions[]): PackingAlgorithm;
  next(): Dimensions;
  place(): Rectangle;
  isFinished(): boolean;
  getShelfHeight(): number;
}

export enum PackingAlgorithms {
  NEXT_FIT_DECREASING_HEIGHT = 'Next Fit Decreasing Height',
}
