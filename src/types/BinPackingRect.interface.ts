import { ColorRect } from './ColorRect.interface';
import { RectangleConfig } from './RectangleConfig.interface';

export type PrevPos = { prevX: number; prevY: number };

export type BinPackingRect = ColorRect<
  RectangleConfig & {
    binId: number;
    removed?: boolean;
    order: number;
  } & PrevPos
>;

export type BinPackingAlgoRect = RectangleConfig & { binId: number };

export type PlacedBinPackingAlgoRect = ColorRect<RectangleConfig & { binId: number } & PrevPos>;
