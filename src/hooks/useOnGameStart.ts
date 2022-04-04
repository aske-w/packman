import { Algorithm } from './../types/enums/AllAlgorithms.enum';
import { Gamemodes } from '../types/enums/Gamemodes.enum';
import { useCallback, useEffect } from 'react';
import useGameStore from '../store/game.store';
import useAlgorithmStore from '../store/algorithm.store';

export const useOnGameStart = <T extends Algorithm>(gameMode: Gamemodes, initAlgorithm: T) => {
  const { setCurrentGame, setHasFinished } = useGameStore();
  const { setAlgorithm, algorithm } = useAlgorithmStore(
    useCallback(({ setAlgorithm, algorithm }) => ({ setAlgorithm, algorithm: algorithm || initAlgorithm }), [initAlgorithm])
  );

  useEffect(() => {
    setAlgorithm(initAlgorithm);
    setCurrentGame(gameMode);
    setHasFinished(false)
    return () => setAlgorithm(null);
  }, []);

  return { algorithm: algorithm as T, setAlgorithm };
};
