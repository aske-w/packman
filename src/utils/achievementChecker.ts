import { useEffect } from "react";
import useAchievementStore, { AchievementLocalstorage, BadgesLocalStorage } from "../store/achievement.store";
import { Badges } from "../types/Badges.enum";
import { ALL_BIN_PACKING_ALGORITHMS } from "../types/BinPackingAlgorithm.interface";
import { ALL_GAMEMODES, Gamemodes } from "../types/Gamemodes.enum";
import { Levels } from "../types/Levels.enum";
import { ALL_PACKING_ALGORITHMS } from "../types/PackingAlgorithm.interface";


const stripPackingAlgorithmsCounter = () => {
  return initPackingAlgorithmsMap(Gamemodes.STRIP_PACKING);
}

const binPackingAlgorithmsCounter = () => {
  return initPackingAlgorithmsMap(Gamemodes.BIN_PACKING);
}

const initPackingAlgorithmsMap = (gamemode: Gamemodes): Map<string, number> => {
  const x = new Map<string, number>();
  switch (gamemode) {
    case Gamemodes.BIN_PACKING:
      ALL_BIN_PACKING_ALGORITHMS.forEach(algo => x.set(algo, 0));
      break;
    case Gamemodes.STRIP_PACKING:
      ALL_PACKING_ALGORITHMS.forEach(algo => x.set(algo, 0));
      break;  
    default:
      throw new Error("Unknown gamemode'" + gamemode + "'");
  }
  return x;
}

/**
 * Returns if the increment was succesful
 * @param map 
 * @param key 
 * @returns 
 */
const increment = <K>(map: Map<K, number>, key: K): boolean => {
  if(map.has(key) && map.get(key) != undefined) {
    map.set(key, map.get(key)! + 1);
    return true;
  }
  return false;
}

// TODO: offload to separate thread?
export const checkAchievements = (gameResults: AchievementLocalstorage[]): BadgesLocalStorage[] => {
  const total: Badges[] = []
  total.push(...checkPackingAchievements(gameResults, Gamemodes.STRIP_PACKING));
  total.push(...checkPackingAchievements(gameResults, Gamemodes.BIN_PACKING));
  total.push(...checkMetaAchievements(gameResults));

  // TODO: the imitation achievements below and completed tutorial in meta achievements
  // AT_LEAST_YOU_TRIED
  // STREAK
  // SUCCESS_ON_FIRST_ATTEMPT
  // COMPLETED_AN_ALGORITHM
  // ACHIEVED_FULL_POINTS
  // IMITATED_ALL_ALGORITHMS

 
  const t = total.map(b => {
    const myObj: BadgesLocalStorage = {title: b, text: b.toString(), date: new Date(Date.now()).toLocaleString()};
    return myObj;
  });
  return t;
}
const checkMetaAchievements = (gameResults: AchievementLocalstorage[]): Badges[] => {
  const res: Badges[] = [];

  // COMPLETED_TUTORIAL
  // TODO: persist tutorial progress for user

  // PLAYED_ALL_GAME_MODES
  const hasPlayedAllGameModes = gameResults.some(x => x.gamemode == Gamemodes.BIN_PACKING) && gameResults.some(x => x.gamemode == Gamemodes.STRIP_PACKING)
  if(hasPlayedAllGameModes)
    res.push(Badges.PLAYED_ALL_GAME_MODES)

  // LEARNING_THE_ROPES
  const hasLearningTheRopes = ALL_GAMEMODES.every(g => wonAllAlgosInGamemodeAtLevel(gameResults, g, Levels.BEGINNER));
  if(hasLearningTheRopes)
    res.push(Badges.LEARNING_THE_ROPES);

  // LOOK_MA_NO_HANDS
  const has_LOOK_MA_NO_HANDS = ALL_GAMEMODES.every(g => wonAllAlgosInGamemodeAtLevel(gameResults, g, Levels.NOVICE));
  if(has_LOOK_MA_NO_HANDS)
    res.push(Badges.LOOK_MA_NO_HANDS);

  // CERTIFIED_EXPERT
  const has_CERTIFIED_EXPERT = ALL_GAMEMODES.every(g => wonAllAlgosInGamemodeAtLevel(gameResults, g, Levels.NOVICE));
  if(has_CERTIFIED_EXPERT)
    res.push(Badges.CERTIFIED_EXPERT)

  return res;
}

const wonAllAlgosInGamemodeAtLevel = (gameresults: AchievementLocalstorage[], gamemode: Gamemodes, level: Levels): boolean => {
  const levelFilteredResults = gameresults.filter(x => x.level == level);
  const gameExistsCounter = initPackingAlgorithmsMap(gamemode);
  levelFilteredResults.forEach(x => increment(gameExistsCounter, x.algorithm))
  let wonAll = true;
  gameExistsCounter.forEach(v => {if(v == 0) wonAll = false;});
  return wonAll;
}

const checkPackingAchievements = (gameResults: AchievementLocalstorage[], gamemode: Gamemodes): Badges[] => {
  // locals
  const gamemodeFilteredResults = gameResults.filter(gr => gr.gamemode == gamemode);
  const allAlgoCounter = initPackingAlgorithmsMap(gamemode);
  const ALGO_COUNT = allAlgoCounter.size;
  
  // COMPETED_AGAINST_ALL_ALGORITHMS_STRIP_PACKING
  gamemodeFilteredResults.forEach(x => increment(allAlgoCounter, x.algorithm));
  let competedAllAlgorithms = true;
  allAlgoCounter.forEach(v => {
    if(v == 0){
      competedAllAlgorithms = false;
    }
  });
  const has_COMPETED_AGAINST_ALL_ALGORITHMS = competedAllAlgorithms;

  // WON_AGAINST_ANY_ALGORITHM
  const has_WON_AGAINST_ANY_ALGORITHM = gamemodeFilteredResults.filter(x => x.wins > 0).length > 0;

  // WON_AGAINST_ALL_ALGORITHM
  const has_WON_AGAINST_ALL_ALGORITHM = gamemodeFilteredResults.filter(x => x.wins > 0).length == ALGO_COUNT;

  // LOSE_AGAINST_ANY_ALGORITHM
  const has_LOSE_AGAINST_ANY_ALGORITHM = gamemodeFilteredResults.filter(x => x.loses > 0).length > 0;

  // LOSE_AGAINST_ALL_ALGORITHM
  const has_LOSE_AGAINST_ALL_ALGORITHM = gamemodeFilteredResults.filter(x => x.loses > 0).length == ALGO_COUNT;

  // COMPLETE_ALL_ALGORITHMS_BEGINNER
  const has_COMPLETE_ALL_ALGORITHMS_BEGINNER = gamemodeFilteredResults.filter(x => x.level == Levels.BEGINNER).length == ALGO_COUNT;
  
  // COMPLETE_ALL_ALGORITHMS_NOVICE
  const has_COMPLETE_ALL_ALGORITHMS_NOVICE = gamemodeFilteredResults.filter(x => x.level == Levels.NOVICE).length == ALGO_COUNT;
  
  // COMPLETE_ALL_ALGORITHMS_EXPERT
  const has_COMPLETE_ALL_ALGORITHMS_EXPERT = gamemodeFilteredResults.filter(x => x.level == Levels.EXPERT).length == ALGO_COUNT;

  let res: Badges[] = [];
  switch (gamemode) {
    case Gamemodes.STRIP_PACKING:
      if(has_COMPETED_AGAINST_ALL_ALGORITHMS)
        res.push(Badges.COMPETED_AGAINST_ALL_ALGORITHMS_STRIP_PACKING);
      if(has_WON_AGAINST_ANY_ALGORITHM)
        res.push(Badges.WON_AGAINST_ANY_ALGORITHM_STRIP_PACKING);
      if(has_WON_AGAINST_ALL_ALGORITHM)
        res.push(Badges.WON_AGAINST_ALL_ALGORITHM_STRIP_PACKING);
      if(has_LOSE_AGAINST_ANY_ALGORITHM)
        res.push(Badges.LOSE_AGAINST_ANY_ALGORITHM_STRIP_PACKING);
      if(has_LOSE_AGAINST_ALL_ALGORITHM)
        res.push(Badges.LOSE_AGAINST_ALL_ALGORITHM_STRIP_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_BEGINNER)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_BEGINNER_STRIP_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_NOVICE)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_STRIP_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_EXPERT)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_EXPERT_STRIP_PACKING);
      break;
    case Gamemodes.BIN_PACKING:
      if(has_COMPETED_AGAINST_ALL_ALGORITHMS)
        res.push(Badges.COMPETED_AGAINST_ALL_ALGORITHMS_BIN_PACKING);
      if(has_WON_AGAINST_ANY_ALGORITHM)
        res.push(Badges.WON_AGAINST_ANY_ALGORITHM_BIN_PACKING);
      if(has_WON_AGAINST_ALL_ALGORITHM)
        res.push(Badges.WON_AGAINST_ALL_ALGORITHM_BIN_PACKING);
      if(has_LOSE_AGAINST_ANY_ALGORITHM)
        res.push(Badges.LOSE_AGAINST_ANY_ALGORITHM_BIN_PACKING);
      if(has_LOSE_AGAINST_ALL_ALGORITHM)
        res.push(Badges.LOSE_AGAINST_ALL_ALGORITHM_BIN_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_BEGINNER)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_BEGINNER_BIN_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_NOVICE)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_BIN_PACKING);
      if(has_COMPLETE_ALL_ALGORITHMS_EXPERT)
        res.push(Badges.COMPLETE_ALL_ALGORITHMS_EXPERT_BIN_PACKING);
      break;
  }
  
  return res;
}
