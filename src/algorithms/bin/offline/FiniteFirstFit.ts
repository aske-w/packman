import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { Shelf } from '../../../types/Shelf.interface';

interface BinShelf extends Shelf {
  binId: number;
}

class FiniteFirstFit<T = RectangleConfig> implements PackingAlgorithm<T> {
  shelves: BinShelf[];
  data: DimensionsWithConfig<T>[] = [];

  /**
   *
   */
  constructor(readonly binSize: Dimensions) {
    this.shelves = [
      {
        remainingWidth: binSize.width,
        bottomY: 0,
        height: 0,
        binId: 0,
      },
    ];
  }

  load(data: DimensionsWithConfig<T>[]): this {
    this.data = data;
    this.prepareData();
    return this;
  }

  getSortedData(): DimensionsWithConfig<T>[] {
    return this.data;
  }

  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }

  next(): DimensionsWithConfig<T> {
    return this.data[0];
  }

  get lastShelf() {
    return this.shelves[this.shelves.length - 1];
  }

  place(): ColorRect<T> & { binId: number } {
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
          x: this.binSize.width - shelf.remainingWidth - nextRect.width,
          y: shelf.bottomY - nextRect.height,
          binId: shelf.binId,
        };
      }
    }

    // if no return, then create new shelf

    // Check if we need to create a new bin

    const lastShelf = this.lastShelf;
    const shouldCreateNewBin = this.shouldCreateNewBin(lastShelf, nextRect);
    const binId = shouldCreateNewBin ? lastShelf.binId + 1 : lastShelf.binId;

    const newShelf = {
      bottomY: shouldCreateNewBin
        ? 0
        : this.lastShelf.bottomY - this.lastShelf.height,
      height: nextRect.height,
      remainingWidth: this.binSize.width - nextRect.width,
      binId,
    };

    this.shelves.push(newShelf);

    return {
      ...nextRect,
      x: 0,
      y: newShelf.bottomY - nextRect.height,
      binId,
    };
  }
  isFinished(): boolean {
    return this.data.length === 0;
  }

  private shouldCreateNewBin(
    shelf: BinShelf,
    nextRect: DimensionsWithConfig<T>
  ) {
    return (
      -1 * shelf.bottomY + shelf.height + nextRect.height > this.binSize.height
    );
  }
}

export default FiniteFirstFit;
