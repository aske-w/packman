import { ColorRect } from './ColorRect.interface';
import { RectangleExPos } from './RectangleExPos.type';
import { DimensionsWithConfig } from './DimensionsWithConfig.type';

export interface OnlineStripPacking<Config = Record<string, any>> {
  place: (rect: RectangleExPos<Config>) => ColorRect<Config>;
}
