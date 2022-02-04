import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { Rectangle } from '../types/Rectangle.interface';
import { Shelf } from '../types/Shelf.interface';

export class FirstFitDecreasingHeight implements PackingAlgorithm {
  data: Dimensions[] = [];
  shelves: Shelf[];
  constructor(readonly gameSize: Dimensions) {
    this.shelves = [
      {
        remainingWidth: gameSize.width,
        bottomY: 0,
        height: 0,
      },
    ];
  }
  load(data: Dimensions[]): this {
    this.data = data;
    this.prepareData();
    return this;
  }

  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }

  next(): Dimensions {
    return this.data[0];
  }

  get lastShelf() {
    return this.shelves[this.shelves.length - 1];
  }

  place(): Rectangle {
    if (this.isFinished()) throw new Error('isFinished');
    const nextRect = this.data.shift()!;

    for (const shelf of this.shelves) {
      if (shelf.height === 0) {
        // initialize first shelf
        shelf.height = nextRect.height;
      }
      if (shelf.remainingWidth >= nextRect.width) {
        // then place
        shelf.remainingWidth = shelf.remainingWidth - nextRect.width;
        return {
          ...nextRect,
          x: this.gameSize.width - shelf.remainingWidth - nextRect.width,
          y: shelf.bottomY - nextRect.height,
        };
      }
    }

    // if no return, then create new shelf

    const newShelf = {
      bottomY: this.lastShelf.bottomY - this.lastShelf.height,
      height: nextRect.height,
      remainingWidth: this.gameSize.width - nextRect.width,
    };

    this.shelves.push(newShelf);

    return {
      ...nextRect,
      x: 0,
      y: newShelf.bottomY - nextRect.height,
    };
  }
  isFinished(): boolean {
    return this.data.length === 0;
  }
}
