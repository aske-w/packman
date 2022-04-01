import Konva from 'konva';
import { nanoid } from 'nanoid';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { PADDING } from '../config/canvasConfig';
import { ColorRect } from '../types/ColorRect.interface';
import { generateData } from '../utils/generateData';

interface UseOnlineStripPackingInventoryParams {
  inventoryWidth: number;
  placedRects: string[];
  visibleInventorySize?: number;
  inventorySize?: number;
}

export const useOnlineStripPackingInventory = ({
  inventoryWidth,
  placedRects,
  visibleInventorySize = 2,
  inventorySize = 50,
}: UseOnlineStripPackingInventoryParams) => {
  const inventory = useMemo(
    () => generateData(inventorySize, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() })),
    [inventorySize, inventoryWidth]
  );

  const compressInventory = useCallback(() => {
    const filtered = inventory.filter(ir => !placedRects.includes(ir.name));

    return filtered.slice(filtered.length - 5, filtered.length).reduce<ColorRect[]>((acc, attrs, i) => {
      const { height, width, name, fill } = attrs;

      const rect = {
        width,
        height,
        x: PADDING,
        y: PADDING,
        name,
        fill,
      };
      if (i === 0) {
        acc.push(rect);
      } else {
        const prev = acc[i - 1];
        rect.y = prev.height + prev.y + PADDING * 2;
        acc.push(rect);
      }

      return acc;
    }, []);
  }, [visibleInventorySize, inventory, placedRects]);

  useEffect(() => {
    setVisibileInventory(compressInventory());
  }, [placedRects]);

  const [visibleInventory, setVisibileInventory] = useState(compressInventory);

  return { visibleInventory, setVisibileInventory, inventory, compressInventory };
};
