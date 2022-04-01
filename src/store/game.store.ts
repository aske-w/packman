import create from 'zustand';
import { Gamemodes } from '../types/enums/Gamemodes.enum';

interface GameState {
  currentGame: Gamemodes | undefined;
  setCurrentGame: (game: Gamemodes) => void;
}

const useGameStore = create<GameState>(set => ({
  currentGame: undefined,
  setCurrentGame: (game: Gamemodes) => set(state => ({ currentGame: game })),
}));

export default useGameStore;
