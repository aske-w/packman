import create from 'zustand';
import { Levels } from '../types/enums/Levels.enum';
import { calculateBinScore, CalculateBinScore, calculateStripScore, getLocalStorage, LOCAL_STORAGE_PREFIX } from '../utils/utils';

export interface Score {
  height: number;
}

interface ScorePayload {
  level: Levels;
  usedRectsArea: number;
  usedGameArea: number;
  averageTimeUsed: number | undefined;
}

type Player = 'user' | 'algorithm';

const LAST_PLAYED_PREFIX = LOCAL_STORAGE_PREFIX + 'last_played';

export type ScoreState = Record<Player, Score> & {
  setScore(score: ScorePayload | number, player: Player): void;
  setBinScore: (payload: Omit<CalculateBinScore, 'averageTimeUsed'>, player: Player) => void;
  setRectanglesLeft(rectangles: number): void;
  setLastPlayed(): void;
  // Percentage
  averageTimeUsed: number | undefined;
  setAverageTimeUsed(avg: number | undefined): void;
  // Total area of rectangles placed in game
  usedRectsAreaUser: number | undefined;
  setUsedRectsAreaUser(avg: number | undefined): void;
  // Area from bottom to highest placed rect in game
  usedGameAreaUser: number | undefined;
  setUsedGameAreaUser(avg: number | undefined): void;
  // Total area of rectangles placed in game
  usedRectsAreaAlgo: number | undefined;
  setUsedRectsAreaAlgo(avg: number | undefined): void;
  // Area from bottom to highest placed rect in game
  usedGameAreaAlgo: number | undefined;
  setUsedGameAreaAlgo(avg: number | undefined): void;
  rectanglesLeft: number;
  lastPlayed: Date | undefined;
  resetScore(): void;
};

const initScore = () => ({ height: 0 });

const useScoreStore = create<ScoreState>((set, get) => ({
  usedGameAreaUser: undefined,
  setUsedGameAreaUser: (area: number) => set(state => ({ ...state, usedGameAreaUser: area })),
  usedRectsAreaUser: undefined,
  setUsedRectsAreaUser: (area: number) => set(state => ({ ...state, usedRectsAreaUser: area })),
  usedGameAreaAlgo: undefined,
  setUsedGameAreaAlgo: (area: number) => set(state => ({ ...state, usedGameAreaAlgo: area })),
  usedRectsAreaAlgo: undefined,
  setUsedRectsAreaAlgo: (area: number) => set(state => ({ ...state, usedRectsAreaAlgo: area })),
  averageTimeUsed: undefined,
  setAverageTimeUsed: (avg: number) => set(state => ({ ...state, averageTimeUsed: avg })),
  algorithm: initScore(),
  user: initScore(),
  lastPlayed: (function () {
    const savedTime = getLocalStorage<string>(LAST_PLAYED_PREFIX);
    if (!savedTime) return;
    return new Date(parseInt(savedTime));
  })(),
  rectanglesLeft: 0,
  setLastPlayed: () =>
    set(state => {
      const date = new Date(Date.now());
      window.localStorage.setItem(LAST_PLAYED_PREFIX, JSON.stringify(date.getTime()));
      return { ...state, lastPlayed: date };
    }),
  setRectanglesLeft: (rectangles: number) => set(state => ({ ...state, rectanglesLeft: rectangles })),
  setScore: (payload, player) =>
    set(state => {
      const score =
        typeof payload === 'number'
          ? payload
          : calculateStripScore(payload.level, payload.usedRectsArea, payload.usedGameArea, payload.averageTimeUsed);
      return {
        ...state,
        [player]: {
          height: score,
        },
      };
    }),
  setBinScore: (payload, player) =>
    set(state => ({ ...state, [player]: { height: calculateBinScore({ ...payload, averageTimeUsed: state.averageTimeUsed }) } })),
  resetScore: () =>
    set(state => {
      return { ...state, user: { height: 0 }, algorithm: { height: 0 } };
    }),
}));

export default useScoreStore;
