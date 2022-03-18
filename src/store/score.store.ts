import create from 'zustand';

export interface Score {
  height: number;
}

type Player = 'user' | 'algorithm';

export type ScoreState = Record<Player, Score> & {
  setScore(score: Score, player: Player): void;
  setRectanglesLeft(rectangles: number): void;
  rectanglesLeft: number;
};

const useScoreStore = create<ScoreState>(set => ({
  algorithm: {
    height: 0,
  },
  user: {
    height: 0,
  },
  rectanglesLeft: 0,
  setRectanglesLeft: (rectangles: number) => set(state => ({ ...state, rectanglesLeft: rectangles })),
  setScore: (payload, player) =>
    set(state => ({
      ...state,
      [player]: {
        ...payload,
      },
    })),
}));

export default useScoreStore;
