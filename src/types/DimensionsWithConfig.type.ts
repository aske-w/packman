import { RectangleConfig } from "./RectangleConfig.interface";
import { Dimensions } from "./Dimensions.interface";

export type DimensionsWithConfig<
  Config extends Record<string, any> = RectangleConfig
> = Dimensions & Config;
