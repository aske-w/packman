import { ColorRect } from "../types/ColorRect.interface";
import { Dimensions } from "../types/Dimensions.interface";
import { DimensionsWithConfig } from "../types/DimensionsWithConfig.type";
import { PackingAlgorithm } from "../types/PackingAlgorithm.interface";
import { Rectangle } from "../types/Rectangle.interface";
import { RectangleConfig } from "../types/RectangleConfig.interface";
import { Shelf } from "../types/Shelf.interface";

const zeroDim = {
  width: 0,
  height: 0,
};

interface Level extends Dimensions {
  bottomY: number;
  first: RectCategory;
}
type RectCategory = "wide" | "narrow";
export class SizeAlternatingStack<T = RectangleConfig>
  implements
    PackingAlgorithm<
      T,
      [narrow: DimensionsWithConfig<T>[], wide: DimensionsWithConfig<T>[]]
    >
{
  /**
   * L2 rectangles, length is n2
   */
  wideRectangles: DimensionsWithConfig<T>[] = [];
  /**
   * L1 rectangles, length is n1
   */
  narrowRectangles: DimensionsWithConfig<T>[] = [];
  level: Level | null = null;

  constructor(readonly gameSize: Dimensions) {}

  /**
   * narrow
   */
  get L1() {
    return this.narrowRectangles;
  }
  /**
   * narrow length
   */
  get N1() {
    return this.L1.length;
  }
  /**
   * wide
   */
  get L2() {
    return this.wideRectangles;
  }
  /**
   * wide length
   */
  get N2() {
    return this.L2.length;
  }

  getSortedData(): [
    narrow: DimensionsWithConfig<T>[],
    wide: DimensionsWithConfig<T>[]
  ] {
    return [this.L1, this.L2];
  }

  load(data: DimensionsWithConfig<T>[]): this {
    this.prepareData(data);
    this.exec();
    return this;
  }

  private prepareData(data: DimensionsWithConfig<T>[]) {
    const wide: DimensionsWithConfig<T>[] = [];
    const tall: DimensionsWithConfig<T>[] = [];
    for (const r of data) {
      if (r.height > r.width) {
        tall.push(r);
      } else {
        wide.push(r);
      }
    }

    tall.sort((a, b) => b.height - a.height);
    wide.sort((a, b) => b.width - a.width);
    this.narrowRectangles = tall;
    this.wideRectangles = wide;
  }

  private wideOrNarrow() {
    const nextTall = this.L1.length ? this.L1[0] : zeroDim;
    const nextWide = this.wideRectangles.length
      ? this.wideRectangles[0]
      : zeroDim;
    if (nextTall.height > nextWide.height) {
      return "narrow";
    } else {
      return "wide";
    }
  }

  next(): DimensionsWithConfig<T> {
    // always use the tallest rectangle
    return this[`${this.wideOrNarrow()}Rectangles`][0];
  }

  place(): ColorRect<T> {
    if (this.rects.length === 0) throw new Error("no more rects");

    return this.rects.shift()!;
  }

  rects: ColorRect<T>[] = [];
  shelves: Shelf[] = [];
  get lastShelf(): Shelf {
    if (this.shelves.length) {
      return this.shelves[this.shelves.length - 1];
    }
    return {
      bottomY: 0,
      height: 0,
      remainingWidth: this.gameSize.width,
    };
  }

  private exec() {
    while (!this.isFinishedExecutingAlgo()) {
      const variant = this.wideOrNarrow();
      const tallest = this[`${variant}Rectangles`].shift()!;

      // create new shelf
      this.shelves.push({
        bottomY: this.lastShelf.bottomY - this.lastShelf.height,
        height: tallest.height,
        remainingWidth: this.gameSize.width - tallest.width,
      });

      this.rects.push({
        ...tallest,
        x: 0,
        y: this.lastShelf.bottomY - tallest.height,
      });

      if (variant === "narrow") {
        this.packWide(this.lastShelf.remainingWidth, this.lastShelf.height);
      } else {
        this.packNarrow(
          this.lastShelf.remainingWidth,
          this.lastShelf.height,
          tallest.width,
          this.lastShelf.bottomY
        );
      }
      this.narrowRectangles = this.narrowRectangles.filter((l) => l !== null);
      this.wideRectangles = this.wideRectangles.filter((l) => l !== null);
    }
  }

  private packNarrow(
    width: number,
    verticalSpace: number,
    x: number,
    bottomY: number
  ) {
    // pack first rectangle that fits width and height wise
    const firstFitsIdx = this.L1.findIndex(
      (r) => r !== null && r.width <= width && r.height <= verticalSpace
    );
    if (firstFitsIdx === -1) return; // no rectangles that fit

    const rect = this.L1[firstFitsIdx];

    //@ts-ignore
    this.L1[firstFitsIdx] = null;

    this.rects.push({ ...rect, x, y: bottomY - rect.height });

    let sliceY = bottomY - rect.height;
    let sliceWidth = rect.width;
    let sliceHeight = verticalSpace - rect.height;

    while (true) {
      // Search L1 (narrow recs)

      const idx = this.L1.findIndex(
        (r) => r !== null && r.width <= sliceWidth && r.height <= sliceHeight
      );

      if (idx !== -1) {
        //   Stack rect
        const narrowRect = this.L1[idx];
        //@ts-ignore
        this.L1[idx] = null;

        this.rects.push({
          ...narrowRect,
          x: x,
          y: sliceY - narrowRect.height,
        });
        sliceHeight -= narrowRect.height;
        sliceY -= narrowRect.height;
      } else {
        break;
      }
    }

    this.packNarrow(width - sliceWidth, verticalSpace, x + sliceWidth, bottomY);
  }

  private packWide(width: number, verticalSpace: number) {
    let j = 0;
    let x = last(this.rects).width;
    let bottomY = this.lastShelf.bottomY;
    let shelfHeight = this.lastShelf.height;
    let lastPlacedWidth = -1;
    let lastPlacedHeight = 0;
    let length = this.N2;

    // is zero at the beginning

    while (verticalSpace > 0 && j <= length) {
      const rect = this.L2[j];
      if (rect && rect.height <= verticalSpace && rect.width <= width) {
        // new vSpace
        verticalSpace -= rect.height;

        const rectX = x + rect.width;

        const rectY = bottomY - rect.height;

        // Place
        this.rects.push({
          ...rect,
          x,
          y: rectY,
        });
        bottomY -= rect.height;
        const isUneven = lastPlacedWidth !== rect.width;
        const isFirst = lastPlacedWidth === -1;

        // remove from l2, after stacking
        //@ts-ignore
        this.L2[j] = null;

        // If rectangles has uneven widths
        if (isUneven && !isFirst) {
          this.packNarrow(
            lastPlacedWidth - rect.width,
            shelfHeight - lastPlacedHeight,
            rectX,
            rectY + rect.height
          );
        }
        lastPlacedHeight += rect.height;

        lastPlacedWidth = rect.width;
      }
      j++;
    }
  }

  private getOpposite(val: RectCategory): RectCategory {
    if (val === "narrow") return "wide";
    return "narrow";
  }

  isFinishedExecutingAlgo(): boolean {
    return this.N1 === 0 && this.N2 === 0;
  }
  isFinished(): boolean {
    return this.rects.length === 0;
  }
}

const last = <T>(arr: T[]) => {
  return arr[arr.length - 1];
};
