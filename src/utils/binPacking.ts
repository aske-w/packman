import { ALGO_MOVE_ANIMATION_DURATION } from '../config/canvasConfig';
import { BinPackingRect } from '../types/BinPackingRect.interface';
import { ColorRect } from '../types/ColorRect.interface';
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
