import Konva from 'konva';
import { nanoid } from 'nanoid';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { PADDING } from '../config/canvasConfig';
import useLevelStore from '../store/level.store';
import { ColorRect } from '../types/ColorRect.interface';
import { Levels } from '../types/enums/Levels.enum';
import { generateData } from '../utils/generateData';

interface UseOnlineStripPackingInventoryParams {
  inventoryWidth: number;
  inventoryHeight: number;
  placedRects: string[];
  inventorySize?: number;
}

export const useOnlineStripPackingInventory = ({
  inventoryWidth,
  inventoryHeight,
  placedRects,
  inventorySize = 50,
}: UseOnlineStripPackingInventoryParams) => {
  const [visibleInventorySize, setVisibleInventorySize] = useState(5);
  const level = useLevelStore(useCallback(({ level }) => level, []));
  const [inventory, setInventory] = useState(() =>
    generateData(inventorySize, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() }))
  );

  useEffect(() => {
    setInventory(generateData(inventorySize, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() })));
  }, [inventorySize, inventoryWidth]);

  const compressInventory = useCallback(() => {
    const filtered = inventory.filter(ir => !placedRects.includes(ir.name));

    return filtered.slice(Math.max(filtered.length - visibleInventorySize, 0), filtered.length).reduce<ColorRect[]>((acc, attrs, i) => {
      const { height, width, name, fill } = attrs;

      const rect = {
        width,
        height,
        x: (inventoryWidth - width) / 2,
        y: inventoryHeight - height - PADDING,
        name,
        fill,
      };
      if (i === 0) {
        acc.push(rect);
      } else {
        const prev = acc[i - 1];
        rect.y = prev.y - height - PADDING * 2;
        acc.push(rect);
      }

      return acc;
    }, []);
  }, [visibleInventorySize, inventory, placedRects]);

  useEffect(() => {
    setVisibileInventory(compressInventory());
  }, [placedRects]);

  useEffect(() => {
    switch (level) {
      case Levels.BEGINNER:
        setVisibleInventorySize(5);
        break;

      case Levels.NOVICE:
        setVisibleInventorySize(3);
        break;

      case Levels.EXPERT:
        setVisibleInventorySize(1);
        break;

      default:
        break;
    }
  }, [level]);

  const [visibleInventory, setVisibileInventory] = useState(compressInventory);

  const resetInventory = useCallback(() => {
    setInventory(generateData(inventorySize, inventoryWidth * 0.6, 10).map(r => ({ ...r, fill: Konva.Util.getRandomColor(), name: nanoid() })));
    setVisibileInventory([]);
  }, [inventorySize, inventoryWidth]);

  return { visibleInventory, resetInventory, setVisibileInventory, inventory, compressInventory };
};
