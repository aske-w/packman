import { Dimensions } from "./Dimensions.interface";

export type DimensionsWithConfig<Config extends Record<string, any> = {}> =
  Dimensions & Config;
