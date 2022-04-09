import { IRect, Vector2d } from 'konva/lib/types';
import { ALGO_MOVE_ANIMATION_DURATION } from '../config/canvasConfig';
import { BinPackingRect } from '../types/BinPackingRect.interface';
import { ColorRect } from '../types/ColorRect.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { RectangleConfig } from '../types/RectangleConfig.interface';
import { pushItemToBack } from './array';
import { compressInventory } from './generateData';
import { sleep } from './utils';

type BinRect = ColorRect<RectangleConfig> & { removed?: boolean; order: number };

interface CompressBinPackingInvProps {
  placedRectIdx: number;
  order: number;
  inventoryWidth: number;
  rectName: string;
  placedRectName: string;
  staticInventory: BinPackingRect[];
  setRenderInventory: (inv: ColorRect[]) => void;
  setStaticInventory: (inv: BinPackingRect[]) => void;
  onCompress(newRectIdx: number): void;
}

export const compressBinPackingInv = ({
  staticInventory,
  placedRectIdx,
  setRenderInventory,
  setStaticInventory,
  onCompress,
  inventoryWidth,
  rectName,
  placedRectName,
  order,
}: CompressBinPackingInvProps) => {
  const inv = [...staticInventory];
  const interactiveIdx = inv.findIndex(r => r.name === rectName);

  inv[interactiveIdx].removed = true;
  inv[placedRectIdx].order = order;

  // Pushes currently placed block at the back of the inventory lust
  pushItemToBack(inv, interactiveIdx);

  let newRectIdx = 0;
  const compressedInv = compressInventory(inv, inventoryWidth, (rect, i) => rect.name === placedRectName && (newRectIdx = i));

  const interactiveInventory = compressedInv.filter(r => !r.removed);

  setRenderInventory(interactiveInventory);
  //   setRectanglesLeft(renderInventory.length - 1);

  // give the order of placement to the starting state
  setStaticInventory(compressedInv);

  /**
   * Let inventory compress before animating
   */
  sleep(ALGO_MOVE_ANIMATION_DURATION * 500).then(() => onCompress(newRectIdx));
};

export function getLocalInteractiveX(inventoryWidth: number, x: number) {
  return -1 * (inventoryWidth - x);
}

export function isBin(id: string | undefined) {
  return id && id.substring(0, 3) === 'bin';
}

export const findBin = (binLayout: IRect[], dropPos: Vector2d, rect: Dimensions & Vector2d) => {
  return binLayout.findIndex(({ height: binHeight, width: binWidth, x: binX, y: binY }) => {
    // Check if the drop position is within the bin
    const binX2 = binX + binWidth;
    const binY2 = binY + binHeight;
    const rectX = dropPos.x;
    const rectY = dropPos.y;
    const rectX2 = dropPos.x + rect.width;
    const rectY2 = dropPos.y + rect.height;

    const fitsX1 = rectX >= binX;
    const fitsX2 = rectX2 <= binX2;
    const fitsY1 = rectY >= binY;
    const fitsY2 = rectY2 <= binY2;

    return fitsX1 && fitsX2 && fitsY1 && fitsY2;
  });
};
