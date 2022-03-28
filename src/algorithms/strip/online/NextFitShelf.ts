import { log } from 'console';
import { Dimensions } from '../../../types/Dimensions.interface';
import { Rectangle } from '../../../types/Rectangle.interface';
import { Shelf } from '../../../types/Shelf.interface';

export class NextFitShelf {
  /**
   *
   */
  constructor(readonly gameSize: Dimensions, readonly r: number) {}

  private denormalize({ height, width, x, y }: Rectangle): Rectangle {
    const unit = 1 / this.gameSize.width;
    return {
      height: height / unit,
      width: width / unit,
      x: x / unit,
      y: y / unit,
    };
  }
  private normalize({ height, width }: Dimensions): Dimensions {
    const unit = 1 / this.gameSize.width;
    return {
      height: height * unit,
      width: width * unit,
    };
  }

  shelves: Shelf[] = [];

  getShelfHeight(rectHeight: number) {
    const r = this.r; //0,5
    const h = rectHeight;

    for (let k = -10; k < 10; k++) {
      //   console.log(`checking: ${(r ** (k + 1)).toFixed(2)} < ${h} <= ${(r ** k).toFixed(2)}`);
      if (r ** (k + 1) < h && h <= r ** k) {
        console.log('found height!', r ** k);
        return r ** k; // Shelf height
      }
    }
    throw new Error('something went wrong :(');
  }

  public place(_rect: Dimensions) {
    const rect = this.normalize(_rect);
    console.log({ rect });

    const shelfHeight = this.getShelfHeight(rect.height);
    for (let i = this.shelves.length - 1; i >= 0; i--) {
      const shelf = this.shelves[i];
      // find shelf with appropiate height
      if (shelf.height === shelfHeight) {
        // check that the rectangle still fits
        if (shelf.remainingWidth >= rect.width) {
          // can place
          const canvasRect = this.denormalize({
            ...rect,
            y: shelf.bottomY - rect.height,
            x: shelf.remainingWidth,
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

    return this.denormalize({
      ...rect,
      y: shelf.bottomY - rect.height,
      x: shelf.remainingWidth,
    });
  }

  get lastShelf() {
    return this.shelves[this.shelves.length - 1];
  }
}
