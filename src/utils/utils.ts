import { IRect } from 'konva/lib/types';
import { Bin } from '../types/Bin.interface';
import { LevelList, Levels } from '../types/enums/Levels.enum';
import { getMultiplier } from './timeMultiplier';

export const LOCAL_STORAGE_PREFIX = 'learn_packing_';

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getYearMonthDay = (date: Date) => date.getUTCFullYear() + date.getUTCMonth() + date.getUTCDay();

export const getLocalStorage = <T>(key: string) => {
  const stored = window.localStorage.getItem(key);
  return stored !== null ? (JSON.parse(stored) as T) : undefined;
};

export const calculateStripScore = (level: Levels, usedRectsArea: number, usedGameArea: number, averageTimeUsed: number = 0): number => {
  const timeMultiplier = getMultiplier(averageTimeUsed);
  const levelsCount = LevelList.length;
  const decrementInterval = 0.05;
  const n = LevelList.indexOf(level);
  const levelModifier = 1 - decrementInterval * (levelsCount - n - 1);
  const areaRatio = usedRectsArea / usedGameArea / 1.2;
  return Math.round(areaRatio * levelModifier * timeMultiplier * 1000);
};

export interface CalculateBinScore {
  bins: Bin;
  binLayouts: IRect[];
  level: Levels;
  averageTimeUsed?: number;
}

export const calculateBinScore = ({ bins, binLayouts, level, averageTimeUsed = 0 }: CalculateBinScore): number => {
  if (binLayouts.length === 1) return 0;

  const timeMultiplier = getMultiplier(averageTimeUsed);

  // Calc used area and subtract from total area
  const usedArea = Object.values(bins).reduce((acc, rects) => {
    const usedArea = rects.reduce((acc, rect) => acc + rect.width * rect.height, 0);
    return acc + usedArea;
  }, 0);
  // There will always be one extra bin with no rects. We remove that
  const totalArea = binLayouts.slice(0, binLayouts.length).reduce((acc, layout) => acc + layout.width * layout.height, 0);

  const levelsCount = LevelList.length;
  const decrementInterval = 0.05;
  const n = LevelList.indexOf(level);
  const levelModifier = 1 - decrementInterval * (levelsCount - n - 1);
  const areaRatio = usedArea / totalArea / 1.2;
  return Math.round(areaRatio * levelModifier * timeMultiplier * 1000);
};
