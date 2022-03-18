import { IRect } from 'konva/lib/types';
import { ColorRect } from '../../types/ColorRect.interface';
import { Dimensions } from '../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';
import { Shelf } from '../../types/Shelf.interface';
type Side = 'left' | 'right';
export class Sleators<T = RectangleConfig> implements PackingAlgorithm<T> {
  widest: DimensionsWithConfig<T>[] = [];
  data: DimensionsWithConfig<T>[] = [];
  lastPlaced: IRect = { height: 0, width: 0, x: 0, y: 0 };
  h0 = 0;
  leftShelf: Shelf;
  rightShelf: Shelf;
  constructor(readonly gameSize: Dimensions) {
    this.leftShelf = {
      remainingWidth: gameSize.width / 2,
      bottomY: 0,
      height: 0,
    };
    this.rightShelf = {
      remainingWidth: gameSize.width / 2,
      bottomY: 0,
      height: 0,
    };
  }

  load(data: DimensionsWithConfig<T>[]): PackingAlgorithm<T, T, DimensionsWithConfig<T>[]> {
    // rectangles wider than half of strip width
    this.widest = data.filter(r => r.width > this.gameSize.width / 2);
    // rest of them
    this.data = data.filter(r => r.width <= this.gameSize.width / 2);
    // sort decreasing height
    this.data.sort((a, b) => b.height - a.height);
    return this;
  }

  rightInitialized = false;
  place(): ColorRect<T> {
    if (this.widest.length > 0) {
      return this.placeWide();
    }
    // real packing.
    // always do the lowest side first.
    console.log({
      left: this.leftShelf.bottomY + this.leftShelf.height,
      right: this.rightShelf.bottomY + this.rightShelf.height,
      bool: this.rightInitialized,
    });

    let [shelf, xOffset] =
      this.leftShelf.bottomY - this.leftShelf.height >= this.rightShelf.bottomY - this.rightShelf.height || !this.rightInitialized
        ? [this.leftShelf, 0]
        : [this.rightShelf, this.gameSize.width / 2];
    let side: Side = xOffset === 0 ? 'left' : 'right';
    console.log(xOffset === 0 ? 'left' : 'right');

    const nextRect = this.data.shift()!;
    if (nextRect.width <= shelf.remainingWidth) {
      console.log('currentshelf', shelf);
      // can place on the shelf
      if (shelf.height === 0) {
        // first time we access
        shelf.height = nextRect.height;
      }
      // update shelf width
      shelf.remainingWidth = shelf.remainingWidth - nextRect.width;
      return {
        ...nextRect,
        x: this.gameSize.width / 2 - shelf.remainingWidth - nextRect.width + xOffset,
        y: shelf.bottomY - nextRect.height + this.h0,
      };
    }

    if (!this.rightInitialized) {
      this.rightInitialized = true;
      [shelf, xOffset] = [this.rightShelf, this.gameSize.width / 2];
      side = 'right';
    }

    // new shelf
    console.log('saving', side, 'shelf');
    this[`${side}Shelf`] = {
      bottomY: shelf.bottomY - shelf.height,
      remainingWidth: this.gameSize.width / 2 - nextRect.width,
      height: nextRect.height,
    };
    shelf = this[`${side}Shelf`];

    return {
      ...nextRect,
      x: xOffset,
      y: shelf.bottomY - nextRect.height + this.h0,
    };
  }
  private placeWide() {
    const next = this.widest.shift()!;
    const y = this.lastPlaced.y - next.height;
    if (this.widest.length === 0) {
      this.h0 = y;
      console.log('h0', this.h0);
    }

    const values = {
      x: 0,
      y,
      ...next,
    };
    this.lastPlaced = values;
    return values;
  }

  isFinished(): boolean {
    return this.widest.length === 0 && this.data.length === 0;
  }
}
