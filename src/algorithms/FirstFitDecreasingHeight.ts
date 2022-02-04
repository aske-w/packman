import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { Rectangle } from '../types/Rectangle.interface';

interface Shelf {
  remainingWidth: number;
  bottomY: number; // this is the bottom edge of the shelf
  height: number; // height of the first rectangle placed on the shelf
}

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

  get numShelves() {
    return this.shelves.length;
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

    // if no return then create new shelf
    const prevShelf = this.shelves[this.numShelves - 1];
    const newShelf = {
      bottomY: prevShelf.bottomY - prevShelf.height,
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
