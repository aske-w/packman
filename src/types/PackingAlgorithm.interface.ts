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
