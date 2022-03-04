import { ColorRect } from './ColorRect.interface';
import { Dimensions } from './Dimensions.interface';
import { DimensionsWithConfig } from './DimensionsWithConfig.type';

export interface PackingAlgorithm<
  Config extends Record<string, any> = {},
  SortedData = DimensionsWithConfig<Config>[]
> {
  load(
    data: DimensionsWithConfig<Config>[]
  ): PackingAlgorithm<Config, SortedData>;
  next(): DimensionsWithConfig<Config>;
  place(): ColorRect<Config>;
  isFinished(): boolean;
  getSortedData(): SortedData;
}

export enum PackingAlgorithms {
  NEXT_FIT_DECREASING_HEIGHT = 'Next Fit Decreasing Height',
  FIRST_FIT_DECREASING_HEIGHT = 'First Fit Decreasing Height',
  BEST_FIT_DECREASING_HEIGHT = 'Best Fit Decreasing Height',
  SIZE_ALTERNATING_STACK = 'Size Alternating Stack',
}

export const ALL_PACKING_ALGORITHMS = [
  PackingAlgorithms.FIRST_FIT_DECREASING_HEIGHT,
  PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT,
  PackingAlgorithms.BEST_FIT_DECREASING_HEIGHT,
  PackingAlgorithms.SIZE_ALTERNATING_STACK,
];
