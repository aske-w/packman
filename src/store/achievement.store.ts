import { Gamemodes } from '../types/Gamemodes.enum';
import { Algorithms } from '../types/AllAlgorithms.enum';
import { Levels } from '../types/Levels.enum';
import create from 'zustand';
import { persist } from './middleware/persist.middleware';
import { Badges } from '../types/Badges.enum';

/**
 * Game mode | algorithm | level | loses | wins
 */
export interface AchievementStore {
  gameResults: AchievementLocalstorage[];
  badges: BadgesLocalStorage[];
  addGameResult: (gamemode: Gamemodes, algorithm: Algorithms, level: Levels, score: number, didWin: boolean) => void;
  setBadges: (badge: Badges, date: Date, text?: string) => void;
}

interface BadgesLocalStorage {
  title: Badges;
  text?: string;
  date: string;
}

interface AchievementLocalstorage {
  gamemode: Gamemodes;
  algorithm: Algorithms;
  level: Levels;
  score: number;
  loses: number;
  wins: number;
  date: string;
}

const useAchievementStore = create<AchievementStore>(
  persist(
    {
      key: 'gameresults',
      allowlist: ['gameResults', 'badges'],
    },
    (set, get) => ({
      badges: get()?.badges || [],
      gameResults: get()?.gameResults || [],
      // (function () {
      //   const storedResults = getLocalStorage<AchievementLocalstorage[]>(GAME_RESULT_PREFIX);
      //   if (!storedResults) return [];
      //   return storedResults;
      // })(),
      addGameResult: (gamemode: Gamemodes, algorithm: Algorithms, level: Levels, score: number, didWin: boolean) =>
        set(state => {
          const gameResults = [...state.gameResults];
          const index = gameResults.findIndex(x => x.gamemode === gamemode && x.algorithm === algorithm && x.level === level);

          console.log({ gamemode, algorithm, level, score, didWin });

          if (index > -1) {
            if (didWin) {
              gameResults[index].wins++;
            } else {
              gameResults[index].loses++;
            }
            if (gameResults[index].score > score) {
              gameResults[index].score = score;
              gameResults[index].date = new Date(Date.now()).toString();
            }
          } else {
            const newData: AchievementLocalstorage = {
              gamemode,
              algorithm,
              level,
              wins: 0,
              loses: 0,
              score: score,
              date: new Date(Date.now()).toString(),
            };
            if (didWin) {
              newData.wins++;
            } else {
              newData.loses++;
            }
            gameResults.push(newData);
          }
          const res = {
            ...state,
            gameResults: gameResults,
          };
          console.log(res.gameResults);
          return res;
        }),
      setBadges: (badge, date, text) =>
        set(state => {
          const badges = [...state.badges];

          const exists = badges.some(b => b.title === badge);

          if (exists) {
            return state;
          }

          badges.push({ title: badge, date: date.toString(), text: text });

          return { ...state };
        }),
    })
  )
);

export default useAchievementStore;