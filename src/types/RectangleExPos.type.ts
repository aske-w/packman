import { ColorRect } from './ColorRect.interface';

export type RectangleExPos<Config = Record<string, any>> = Omit<ColorRect<Config>, 'x' | 'y'>;
