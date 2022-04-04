import { Algorithm } from './../types/enums/AllAlgorithms.enum';
import { Gamemodes } from '../types/enums/Gamemodes.enum';
import { useCallback, useEffect } from 'react';
import useGameStore from '../store/game.store';
import useAlgorithmStore from '../store/algorithm.store';
import { useEvents } from './useEvents';

export const useOnGameStart = <T extends Algorithm>(gameMode: Gamemodes, initAlgorithm: T) => {
  const { setCurrentGame } = useGameStore();
  const { setAlgorithm, algorithm } = useAlgorithmStore(
    useCallback(({ setAlgorithm, algorithm }) => ({ setAlgorithm, algorithm: algorithm || initAlgorithm }), [initAlgorithm])
  );

  useEvents(algorithm);
  useEffect(() => {
    setAlgorithm(initAlgorithm);
    setCurrentGame(gameMode);

    return () => setAlgorithm(null);
  }, []);

  return { algorithm: algorithm as T, setAlgorithm };
};
