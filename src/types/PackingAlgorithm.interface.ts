import { Dimensions } from './Dimensions.interface';
import { Rectangle } from './Rectangle.interface';

export interface PackingAlgorithm {
  gameSize: Dimensions;
  data: Dimensions[];
  load(data: Dimensions[]): void;
  next(): Dimensions;
  place(): Rectangle;
  isFinished(): boolean;
}
