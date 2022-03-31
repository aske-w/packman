import create from 'zustand';
import { Levels } from '../types/Levels.enum';
import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
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
  setEndScore(algo: PackingAlgorithms, level: Levels): void;
  getPersonalBest(algo: PackingAlgorithms, level: Levels): Score | undefined;
  setLastPlayed(): void;
  setAverageTimeUsed(avg: number | undefined): void;
  setUsedRectsArea(avg: number | undefined): void;
  setUsedGameArea(avg: number | undefined): void;
  // Percentage
  averageTimeUsed: number | undefined;
  // Total area of rectangles placed in game
  usedRectsArea: number | undefined;
  // Area from bottom to highest placed rect in game
  usedGameArea: number | undefined;
  rectanglesLeft: number;
  lastPlayed: Date | undefined;
  readonly personalBest: MappedScore | undefined;
};

const initScore = () => ({ height: 0 });

const useScoreStore = create<ScoreState>((set, get) => ({
  usedGameArea: undefined,
  setUsedGameArea: (area: number) => set(state => ({...state, usedGameArea: area})),
  usedRectsArea: undefined,
  setUsedRectsArea: (area: number) => set(state => ({...state, usedRectsArea: area})),
  averageTimeUsed: undefined,
  setAverageTimeUsed: (avg: number) => set(state => {
    console.log("avg time used store");
    return {...state, averageTimeUsed: avg}
  }),
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
  getPersonalBest: (algo: PackingAlgorithms, level: Levels) => get().personalBest?.[algo]?.[level],
  setEndScore: (algo: PackingAlgorithms, level: Levels) =>
    set(state => {
      const prevScore = state.getPersonalBest(algo, level);
      const currScore = state.user;

      if (!prevScore || currScore.height < prevScore.height) {
        const levelScore = state.personalBest?.[algo] || { [Levels.BEGINNER]: undefined, [Levels.NOVICE]: undefined, [Levels.EXPERT]: undefined };

        const newPersonalBest: MappedScore = { ...state.personalBest, [algo]: { ...levelScore, [level]: { ...currScore } } };
        window.localStorage.setItem(SCORE_PREFIX, JSON.stringify(newPersonalBest));

        return { ...state, personalBest: newPersonalBest };
      }

      return state;
    }),
}));

export default useScoreStore;
