import create from "zustand";
import { Levels } from "../types/Levels.enum";

export interface LevelState {
  level: Levels;
  setLevel: (level: Levels) => void;
}

const useLevelStore = create<LevelState>((set) => ({
  level: Levels.BEGINNER,
  setLevel: (level: Levels) => set((state) => ({ ...state, level })),
}));

export default useLevelStore;
