import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { Rectangle } from '../types/Rectangle.interface';

interface Shelf {
  remainingWidth: number;
  bottomY: number; // this is the bottom edge of the shelf
  height: number; // height of the first rectangle placed on the shelf
}

export class NextFitDecreasingHeight implements PackingAlgorithm {
  data: Dimensions[] = [];
  shelf: Shelf;
  constructor(readonly gameSize: Dimensions) {
    this.shelf = {
      remainingWidth: gameSize.width,
      bottomY: 0,
      height: 0,
    };
  }
  load(data: Dimensions[]): void {
    this.data = data;
    this.prepareData();
  }

  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }

  next(): Dimensions {
    return this.data[0];
  }

  place(): Rectangle {
    if (this.isFinished()) throw new Error('isFinished');
    const nextRect = this.data.shift()!;

    if (nextRect.width <= this.shelf.remainingWidth) {
      // can place on the shelf
      if (this.shelf.height === 0) {
        // first time we access
        this.shelf.height = nextRect.height;
      }
      // update shelf width
      this.shelf.remainingWidth = this.shelf.remainingWidth - nextRect.width;
      return {
        ...nextRect,
        x: this.gameSize.width - this.shelf.remainingWidth,
        y: this.shelf.bottomY - nextRect.height,
      };
    }

    // new shelf
    this.shelf = {
      bottomY: this.shelf.bottomY - this.shelf.height,
      remainingWidth: this.gameSize.width - nextRect.width,
      height: nextRect.height,
    };

    return {
      ...nextRect,
      x: 0,
      y: this.shelf.bottomY - nextRect.height,
    };
  }
  isFinished(): boolean {
    return this.data.length === 0;
  }
}
