import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { Rectangle } from '../types/Rectangle.interface';
import { Shelf } from '../types/Shelf.interface';

export class BestFitDecreasingHeight implements PackingAlgorithm {
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
    let bestShelf: Shelf | null = null;

    for (const shelf of this.shelves) {
      if (shelf.height === 0) {
        // initialize first shelf
        shelf.height = nextRect.height;
        bestShelf = shelf;
      }

      if (shelf.remainingWidth < nextRect.width) {
        // if the rect cannot fit, just continue
        continue;
      }

      const remainingShelfSpace = shelf.remainingWidth - nextRect.width;
      const spaceLeftOver = this.gameSize.width - remainingShelfSpace;

      if (spaceLeftOver >= 0) {
        if (!bestShelf) {
          // if there is no best shelf yet (i.e. first row)
          bestShelf = shelf;
        } else if (remainingShelfSpace < bestShelf.remainingWidth) {
          //  if the new shelf has less remaining space, select that one instead
          bestShelf = shelf;
        }
      }
    }

    if (bestShelf) {
      // we found a suitable shelf
      bestShelf.remainingWidth = bestShelf.remainingWidth - nextRect.width;
      return {
        ...nextRect,
        x: this.gameSize.width - bestShelf.remainingWidth - nextRect.width,
        y: bestShelf.bottomY - nextRect.height,
      };
    }

    // if no return, then create new shelf

    const newShelf = {
      bottomY: this.lastShelf.bottomY - this.lastShelf.height,
      height: nextRect.height,
      remainingWidth: this.gameSize.width - nextRect.width,
    };
    console.log({ newShelf });

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
