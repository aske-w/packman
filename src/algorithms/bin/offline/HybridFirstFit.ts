import { ColorRect } from "../../../types/ColorRect.interface";
import { Dimensions } from "../../../types/Dimensions.interface";
import { DimensionsWithConfig } from "../../../types/DimensionsWithConfig.type";
import { PackingAlgorithm } from "../../../types/PackingAlgorithm.interface";
import { RectangleConfig } from "../../../types/RectangleConfig.interface";
import { FirstFitDecreasingHeight } from "../../strip/FirstFitDecreasingHeight";

type FFDHShelves<T> = {
  shelfHeight: number;
  rects: ColorRect<T>[];
}[];

interface Bin {
  remainingHeight: number;
  id: number;
}

class HybridFirstFit<T = RectangleConfig> implements PackingAlgorithm<T> {
  private ffdh: FirstFitDecreasingHeight<DimensionsWithConfig<T>>;
  private bins: Bin[];
  private placedRectangles: (ColorRect<T> & { binId: number })[] = [];
  private ffdhShelves: FFDHShelves<T> = [];

  constructor(readonly binSize: Dimensions) {
    this.ffdh = new FirstFitDecreasingHeight(binSize);
    this.bins = [
      {
        remainingHeight: binSize.width,
        id: 0,
      },
    ];
  }

  load(data: DimensionsWithConfig<T>[]): this {
    this.ffdh.load([...data]);

    this.prepareData();
    return this;
  }

  private prepareData() {
    this.buildShelves();
    this.buildBins();
  }

  private buildShelves() {
    let shelfId = 0;

    while (!this.ffdh.isFinished()) {
      const rect = this.ffdh.place();

      const currFfdhShelfIdx = this.ffdhShelves.length - 1;

      //
      const isNewShelf = shelfId !== this.ffdh.shelves.length;
      const currShelf = this.ffdh.lastShelf;

      //   Shelf does not exist and we create a new one
      if (isNewShelf || this.ffdh.shelves.length === 0) {
        this.ffdhShelves.push({ shelfHeight: currShelf.height, rects: [rect] });
        shelfId = this.ffdh.shelves.length;
      } else {
        //   We add rect to the current shelf
        this.ffdhShelves[currFfdhShelfIdx].rects.push(rect);
      }
    }
  }

  private buildBins(): void {
    const bins = this.ffdhShelves.reduce<(ColorRect<T> & { binId: number })[]>(
      (acc, shelf) => {
        const bin = this.bins.find(
          (b) => b.remainingHeight <= shelf.shelfHeight
        );

        if (bin) {
          const bottomY = this.binSize.height - bin.remainingHeight;
          shelf.rects.forEach((r) =>
            acc.push({ ...r, y: bottomY - r.height, binId: bin.id })
          );

          bin.remainingHeight -= shelf.shelfHeight;
          return acc;
        }

        // Create new bin
        const newBin = {
          id: this.bins.length + 1,
          remainingHeight: this.binSize.height - shelf.shelfHeight,
        };

        // Place in new bin
        shelf.rects.forEach((r) =>
          acc.push({ ...r, y: -r.height, binId: newBin.id })
        );

        this.bins.push(newBin);

        return acc;
      },
      []
    );

    this.placedRectangles = bins;
  }

  place(): ColorRect<T> & { binId: number } {
    if (this.isFinished()) throw new Error("isFinished");

    return this.placedRectangles.shift()!;
  }

  isFinished(): boolean {
    return this.placedRectangles.length === 0;
  }

  private get latestBin() {
    return this.bins[this.bins.length - 1];
  }
}

export default HybridFirstFit;
