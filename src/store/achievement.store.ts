import { Gamemodes } from '../types/Gamemodes.enum';
import { Algorithms } from '../types/AllAlgorithms.enum';
import { Levels } from '../types/Levels.enum';
import create from 'zustand';
import useAlgorithmStore from './algorithm.store';
import useLevelStore from './level.store';
import { getLocalStorage } from '../utils/utils';
import useGameStore from './game.store';

/**
 * Game mode | algorithm | level | loses | wins
 */
export interface AchievementStore {
  gameResults: AchievementLocalstorage[] | undefined;
  addGameResult: (didWin: boolean) => void;
}

const name = 'gameResults';

interface AchievementLocalstorage {
  gamemode: Gamemodes;
  algorithm: Algorithms;
  level: Levels;
  loses: number;
  wins: number;
}

const useAchievementStore = create<AchievementStore>((set, get) => ({
  gameResults: (function () {
    const storedResults = getLocalStorage<AchievementLocalstorage[]>(name);
    if (!storedResults) return [];
    return storedResults;
  })(),
  addGameResult: (didWin: boolean) =>
    set(state => {
      const { currentGame: gamemode } = useGameStore();
      const { algorithm } = useAlgorithmStore();
      const { level } = useLevelStore();
      const index = state.gameResults!.findIndex(x => x.gamemode == gamemode && x.algorithm == algorithm && x.level == level);
      if (index > -1) {
        if (didWin) {
          state.gameResults![index].wins++;
        } else {
          state.gameResults![index].loses++;
        }
      } else {
        const newData: AchievementLocalstorage = { gamemode: gamemode!, algorithm, level, wins: 0, loses: 0 };
        if (didWin) {
          newData.wins++;
        } else {
          newData.loses++;
        }
        state.gameResults!.push(newData);
      }
      window.localStorage.setItem(name, JSON.stringify(state.gameResults));
      return {};
    }),
}));

export default useAchievementStore;
