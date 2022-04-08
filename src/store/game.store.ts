import create from 'zustand';
import { Gamemodes } from '../types/enums/Gamemodes.enum';

interface GameState {
  hasFinished: boolean;
  setHasFinished: (hasFinished: boolean) => void;
  currentGame: Gamemodes | undefined;
  setCurrentGame: (game: Gamemodes) => void;
}

const useGameStore = create<GameState>(set => ({
  hasFinished: false,
  setHasFinished: (hasFinished: boolean) => set(state => ({ ...state, hasFinished: hasFinished })),
  currentGame: undefined,
  setCurrentGame: (game: Gamemodes) => set(state => ({ ...state, currentGame: game })),
}));

export default useGameStore;
