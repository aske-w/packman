import { ColorRect } from '../../../types/ColorRect.interface';
import { Dimensions } from '../../../types/Dimensions.interface';
import { DimensionsWithConfig } from '../../../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../../../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../../../types/RectangleConfig.interface';
import { Shelf } from '../../../types/Shelf.interface';

class FiniteNextFit<T = RectangleConfig> implements PackingAlgorithm<T> {
  data: DimensionsWithConfig<T>[] = [];
  private shelf: Shelf;
  private currBin = 0;

  /**
   * Sort all items by size then place the largest first
   */
  constructor(readonly binSize: Dimensions) {
    this.shelf = {
      remainingWidth: binSize.width,
      bottomY: 0,
      height: 0,
    };
  }

  load(data: DimensionsWithConfig<T>[]): this {
    this.data = data;
    this.prepareData();
    return this;
  }

  getSortedData(): DimensionsWithConfig<T>[] {
    return [...this.data];
  }

  next(): DimensionsWithConfig<T> {
    return this.data[0];
  }

  place(): ColorRect<T & { binId: number }> {
    if (this.isFinished()) throw new Error('isFinished');

    // Check if theres is room in bin

    const nextRect = this.data.shift()!;

    // Then place in bin
    return { ...this.shelfPack(nextRect), binId: this.currBin };
  }

  private shelfPack(nextRect: DimensionsWithConfig<T>) {
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
        x: this.binSize.width - this.shelf.remainingWidth - nextRect.width,
        y: this.shelf.bottomY - nextRect.height,
      };
    }

    // Create new bin if cannot fit

    const shouldCreateNewBin = -1 * this.shelf.bottomY + this.shelf.height + nextRect.height > this.binSize.height;

    const bottomY = shouldCreateNewBin ? 0 : this.shelf.bottomY - this.shelf.height;

    if (shouldCreateNewBin) {
      this.currBin++;
    }

    // new shelf
    this.shelf = {
      bottomY,
      remainingWidth: this.binSize.width - nextRect.width,
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

  /**
   * Sort decreasing by their size
   */
  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }
}

export default FiniteNextFit;
