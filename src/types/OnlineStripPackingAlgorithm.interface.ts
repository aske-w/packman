import { ColorRect } from './ColorRect.interface';
import { RectangleExPos } from './RectangleExPos.type';
import { DimensionsWithConfig } from './DimensionsWithConfig.type';

export interface OnlineStripPacking<Config = Record<string, any>> {
  place: (rect: RectangleExPos<Config>) => ColorRect<Config>;
}

export enum OnlineStripPackingAlgorithms {
  NEXT_FIT_SHELF = 'Next Fit Shelf',
}

export const ALL_ONLINE_STRIP_PACKING_ALGORITHMS = [OnlineStripPackingAlgorithms.NEXT_FIT_SHELF];
