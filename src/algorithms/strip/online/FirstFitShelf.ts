import { Dimensions } from '../../../types/Dimensions.interface';
import { OnlineStripPacking } from '../../../types/OnlineStripPackingAlgorithm.interface';
import { Rectangle } from '../../../types/Rectangle.interface';
import { Shelf } from '../../../types/Shelf.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { ColorRect } from '../../../types/ColorRect.interface';
import { RectangleExPos } from '../../../types/RectangleExPos.type';

export class FirstFitShelf<T extends Record<string, any> = Record<string, any>> implements OnlineStripPacking<T> {

  constructor(readonly gameSize: Dimensions, readonly r: number, readonly debug = false) {}

  private denormalize(rect: ColorRect<T>): ColorRect<T> {
    const unit = 1 / this.gameSize.width;
    return {
      ...rect,
      height: rect.height / unit,
      width: rect.width / unit,
      x: rect.x / unit,
      y: rect.y / unit,
    };
  }
  private normalize(rect: RectangleExPos<T>): RectangleExPos<T> {
    const unit = 1 / this.gameSize.width;
    return {
      ...rect,
      height: rect.height * unit,
      width: rect.width * unit,
    };
  }

  shelves: Shelf[] = [];

  getShelfHeight(rectHeight: number) {
    const r = this.r;
    const h = rectHeight;

    for (let k = -10; k < 1000; k++) {
      if (this.debug) console.debug(`checking: ${(r ** (k + 1)).toFixed(2)} < ${h} <= ${(r ** k).toFixed(2)}`);
      if (r ** (k + 1) < h && h <= r ** k) {
        if (this.debug) console.debug('found height!', r ** k);
        return r ** k; // Shelf height
      }
    }
    throw new Error('something went wrong :(');
  }

  public place(_rect: RectangleExPos<T>): ColorRect<T> {
    const rect = this.normalize(_rect);

    const shelfHeight = this.getShelfHeight(rect.height);
    for (let i = 0; i < this.shelves.length; i++) {
      const shelf = this.shelves[i];
      // find shelf with appropiate height
      if (shelf.height === shelfHeight) {
        // check that the rectangle still fits
        if (shelf.remainingWidth >= rect.width) {
          // can place
          //@ts-expect-error
          const canvasRect = this.denormalize({
            ..._rect,
            ...rect,
            y: shelf.bottomY - rect.height,
            x: 1 - shelf.remainingWidth,
          });

          shelf.remainingWidth -= rect.width;
          return canvasRect;
        }
      }
    }

    // Create new shelf
    let bottomY = 0;

    if (this.shelves.length > 0) {
      bottomY = this.lastShelf.bottomY - this.lastShelf.height;
    }
    const shelf = {
      remainingWidth: 1 - rect.width,
      bottomY,
      height: shelfHeight,
    };

    this.shelves.push(shelf);

    //@ts-expect-error
    return this.denormalize({
      ..._rect,
      ...rect,
      y: shelf.bottomY - rect.height,
      x: 0,
    });
  }

  get lastShelf() {
    return this.shelves[this.shelves.length - 1];
  }
}
