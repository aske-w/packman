import { IRect } from 'konva/lib/types';
import { ColorRect } from '../../types/ColorRect.interface';
import { Dimensions } from '../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';
import { Shelf } from '../../types/Shelf.interface';

type Side = `${'left' | 'right'}Shelf`;
export class Sleators<T extends Record<string, any> = RectangleConfig> implements PackingAlgorithm<T> {
  private widest: DimensionsWithConfig<T>[] = [];
  private data: DimensionsWithConfig<T>[] = [];
  private lastPlaced: IRect = { height: 0, width: 0, x: 0, y: 0 };

  private firstLinePlaced = false;
  private bottomShelfRemainingWidth: number;
  private leftShelf: Shelf;
  private rightShelf: Shelf;
  private lastSidePicked: Side = 'rightShelf';
  constructor(readonly gameSize: Dimensions) {
    this.bottomShelfRemainingWidth = gameSize.width;
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

  place(): ColorRect<T> {
    if (this.widest.length > 0) {
      return this.placeWide();
    }
    const h0 = this.lastPlaced.y; // figure out where we should start

    let nextRect = this.data.shift()!;

    // this is the firstline that goes across
    if (!this.firstLinePlaced) {
      if (this.bottomShelfRemainingWidth === this.gameSize.width) {
        // if we havent placed anything yet. then we know that the next rect
        // must be the tallest in this shelf

        this.leftShelf.bottomY = -nextRect.height;
      }
      if (nextRect.width <= this.bottomShelfRemainingWidth) {
        // can still place
        const x = this.gameSize.width - this.bottomShelfRemainingWidth;

        this.bottomShelfRemainingWidth -= nextRect.width;
        const halfWidth = this.gameSize.width / 2;

        if (this.rightShelf.bottomY === 0 && x <= halfWidth && x + nextRect.width > halfWidth) {
          // first rectangle where some of it is on the right side of the middle
          this.rightShelf.bottomY = -nextRect.height;
        }
        return {
          ...nextRect,
          x,
          y: -nextRect.height + h0,
        };
      } else {
        // done placing the initial shelf
        this.firstLinePlaced = true;
      }
    }

    // always check the same side first (defualts to right)
    let shelf = this.lastSidePicked;

    // can place on the last shelf
    if (nextRect.width <= this[shelf].remainingWidth) {
      if (this[shelf].height === 0) {
        // first time we access
        this[shelf].height = nextRect.height;
      }
      // update shelf width
      this[shelf].remainingWidth = this[shelf].remainingWidth - nextRect.width;
      return {
        ...nextRect,
        x: this.gameSize.width / 2 - this[shelf].remainingWidth - nextRect.width + this.getXOffset(shelf),
        y: this[shelf].bottomY - nextRect.height + h0,
      };
    } else {
      // If we couldnt place on the same shelf, update the shelf by picking the
      // lowest of the two sides
      shelf = this.leftShelf.bottomY - this.leftShelf.height >= this.rightShelf.bottomY - this.rightShelf.height ? 'leftShelf' : 'rightShelf';
      // update our pick
      this.lastSidePicked = shelf;
    }

    // Now we're initializing the shelf on new side
    this[shelf] = {
      bottomY: this[shelf].bottomY - this[shelf].height,
      remainingWidth: this.gameSize.width / 2 - nextRect.width,
      height: nextRect.height,
    };

    // and we place there
    return {
      ...nextRect,
      x: this.getXOffset(shelf),
      y: this[shelf].bottomY - nextRect.height + h0,
    };
  }

  private getXOffset(side: Side) {
    if (side === 'leftShelf') return 0;
    return this.gameSize.width / 2;
  }

  private placeWide() {
    const next = this.widest.shift()!;
    const y = this.lastPlaced.y - next.height;

    const values = {
      ...next,
      x: 0,
      y,
    };
    this.lastPlaced = { ...values };

    return values;
  }

  isFinished(): boolean {
    return this.widest.length === 0 && this.data.length === 0;
  }
}
