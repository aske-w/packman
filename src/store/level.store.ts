import create from 'zustand';
import { getPermissions } from '../permissions/permissions';
import { Levels } from '../types/enums/Levels.enum';
import { Permission } from '../types/Permission.interface';

export interface LevelState {
  level: Levels;
  setLevel: (level: Levels) => void;
  getPermission: () => Permission;
}

const useLevelStore = create<LevelState>((set, get) => ({
  level: Levels.BEGINNER,
  setLevel: (level: Levels) => set(state => ({ ...state, level })),
  getPermission: () => getPermissions(get().level),
}));

export default useLevelStore;
