import { ColorRect } from './ColorRect.interface';
import { Dimensions } from './Dimensions.interface';
import { DimensionsWithConfig } from './DimensionsWithConfig.type';

export interface PackingAlgorithm<
  Config extends Record<string, any> = {},
  ReturnConfig extends Config = Config,
  SortedData = DimensionsWithConfig<Config>[]
> {
  load(data: DimensionsWithConfig<Config>[]): PackingAlgorithm<Config, ReturnConfig, SortedData>;
  // next(): DimensionsWithConfig<Config>;
  place(): ColorRect<ReturnConfig>;
  isFinished(): boolean;
  // getSortedData(): SortedData;
}

export enum PackingAlgorithmEnum {
  NEXT_FIT_DECREASING_HEIGHT = 'Next Fit Decreasing Height',
  FIRST_FIT_DECREASING_HEIGHT = 'First Fit Decreasing Height',
  BEST_FIT_DECREASING_HEIGHT = 'Best Fit Decreasing Height',
  SIZE_ALTERNATING_STACK = 'Size Alternating Stack',
  SLEATORS = 'Sleators',
}

export const ALL_PACKING_ALGORITHMS = [
  PackingAlgorithmEnum.FIRST_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.BEST_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.SIZE_ALTERNATING_STACK,
  PackingAlgorithmEnum.SLEATORS,
];
