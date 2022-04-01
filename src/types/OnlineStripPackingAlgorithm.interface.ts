import { ColorRect } from './ColorRect.interface';
import { RectangleExPos } from './RectangleExPos.type';

export interface OnlineStripPacking<Config extends Record<string, any> = Record<string, any>> {
  place: (rect: RectangleExPos<Config>) => ColorRect<Config>;
}
