import { ColorRect } from './ColorRect.interface';

export type RectangleExPos<Config extends Record<string, any> = Record<string, any>> = Omit<ColorRect<Config>, 'x' | 'y'>;
