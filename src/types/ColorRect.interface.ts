import { Vector2d } from 'konva/lib/types';
import { DimensionsWithConfig } from './DimensionsWithConfig.type';
import { RectangleConfig } from './RectangleConfig.interface';

export type ColorRect<T = RectangleConfig> = DimensionsWithConfig<T> & Vector2d;
