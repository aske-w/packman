import { LevelList, Levels } from '../types/Levels.enum';
import { getMultiplier } from './timeMultiplier';

export const LOCAL_STORAGE_PREFIX = 'learn_packing_';

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getYearMonthDay = (date: Date) => date.getUTCFullYear() + date.getUTCMonth() + date.getUTCDay();

export const getLocalStorage = <T>(key: string) => {
  const stored = window.localStorage.getItem(key);
  return stored !== null ? (JSON.parse(stored) as T) : undefined;
};

export const calculateScore = (level: Levels, usedRectsArea: number, usedGameArea: number, averageTimeUsed: number = 0): number => {
  const timeMultiplier = getMultiplier(averageTimeUsed);
  const levelsCount = LevelList.length;
  const decrementInterval = 0.05;
  const n = LevelList.indexOf(level);
  const levelModifier = 1 - decrementInterval * (levelsCount - n - 1);
  const areaRatio = usedRectsArea / usedGameArea / 1.2;
  return areaRatio * levelModifier * timeMultiplier * 1000;
};
