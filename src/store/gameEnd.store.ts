import create from 'zustand';
import { GameEndModalTitles } from '../types/GameEndModalTitles.enum';

export interface GameEndStore {
  blur: boolean;
  setBlur: (value: boolean) => void;
  title: GameEndModalTitles;
  setTitle: (value: GameEndModalTitles) => void;
}

const useGameEndStore = create<GameEndStore>(set => ({
  blur: false,
  setBlur: (value: boolean) => set(state => ({ ...state, blur: value })),
  title: GameEndModalTitles.FINISHED,
  setTitle: (value: GameEndModalTitles) => set(state => ({ ...state, title: value })),
}));

export default useGameEndStore;
