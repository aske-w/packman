import create from 'zustand';
import { GameEndModalTitle } from '../types/enums/GameEndModalTitle.enum';

export interface GameEndStore {
  blur: boolean;
  setBlur: (value: boolean) => void;
  title: GameEndModalTitle;
  setTitle: (value: GameEndModalTitle) => void;
}

const useGameEndStore = create<GameEndStore>(set => ({
  blur: false,
  setBlur: (value: boolean) => set(state => ({ ...state, blur: value })),
  title: GameEndModalTitle.FINISHED,
  setTitle: (value: GameEndModalTitle) => set(state => ({ ...state, title: value })),
}));

export default useGameEndStore;
