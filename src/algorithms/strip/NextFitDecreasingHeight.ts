import { ColorRect } from '../../types/ColorRect.interface';
import { Dimensions } from '../../types/Dimensions.interface';
import { PackingAlgorithm } from '../../types/PackingAlgorithm.interface';
import { DimensionsWithConfig } from '../../types/DimensionsWithConfig.type';
import { Shelf } from '../../types/Shelf.interface';
import { RectangleConfig } from '../../types/RectangleConfig.interface';

export class NextFitDecreasingHeight<T extends Record<string, any> = RectangleConfig> implements PackingAlgorithm<T> {
  data: DimensionsWithConfig<T>[] = [];
  shelf: Shelf;
  constructor(readonly gameSize: Dimensions) {
    this.shelf = {
      remainingWidth: gameSize.width,
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

  private prepareData() {
    this.data.sort((a, b) => b.height - a.height);
  }

  next(): DimensionsWithConfig<T> {
    return this.data[0];
  }

  place(): ColorRect<T> {
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
        x: this.gameSize.width - this.shelf.remainingWidth - nextRect.width,
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
