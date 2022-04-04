import create from 'zustand';
import { Algorithm } from '../types/enums/AllAlgorithms.enum';
import { Levels } from '../types/enums/Levels.enum';
import { devtools } from 'zustand/middleware';
import { getLocalStorage, getYearMonthDay, LOCAL_STORAGE_PREFIX } from '../utils/utils';

export interface Score {
  height: number;
}

interface PersistedScore extends Score {}

type MappedScore = Record<string, Record<Levels, PersistedScore | undefined>>;

type Player = 'user' | 'algorithm';

const SCORE_PREFIX = LOCAL_STORAGE_PREFIX + 'score';
const LAST_PLAYED_PREFIX = LOCAL_STORAGE_PREFIX + 'last_played';

export type ScoreState = Record<Player, Score> & {
  setScore(score: Score, player: Player): void;
  setRectanglesLeft(rectangles: number): void;
  getPersonalBest(algo: Algorithm, level: Levels): Score | undefined;
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
  readonly personalBest: MappedScore | undefined;
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
  personalBest: getLocalStorage<MappedScore>(SCORE_PREFIX),
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
    set(state => ({
      ...state,
      [player]: {
        ...payload,
      },
    })),
  getPersonalBest: (algo: Algorithm, level: Levels) => get().personalBest?.[algo]?.[level],
}));

export default useScoreStore;
