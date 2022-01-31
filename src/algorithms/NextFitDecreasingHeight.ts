import { PackingAlgorithm } from './PackingAlgorithm.interface';
import { Dimensions } from './Dimensions.interface';
import { Rectangle } from './Rectangle.interface';

interface Shelf {
  remainingWidth: number;
  y: number;
}

export class NextFitDecreasingHeight implements PackingAlgorithm {
  data: Dimensions[] = [];
  shelf: Shelf;
  constructor(readonly gameSize: Dimensions) {
    this.shelf = {
      remainingWidth: gameSize.width,
      y: 0,
    };
  }
  load(data: Dimensions[]): void {
    this.data = data;
  }

  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }

  next(): Dimensions {
    return this.data[0];
  }

  place(): Rectangle {
    if (this.isFinished()) throw new Error('isFinished');
    const next = this.data.shift()!;

    if (next.width <= this.shelf.remainingWidth) {
      // can place on the shelf
      return {
        ...next,
        x: this.gameSize.width - this.shelf.remainingWidth,
        y: this.shelf.y - next.height,
      };
    }

    // new shelf
    this.shelf = {
      y: this.shelf.y,
    };
  }
  isFinished(): boolean {
    return this.data.length === 0;
  }
}
