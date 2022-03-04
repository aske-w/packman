import { useCallback, useRef, useState } from 'react';
import { Dimensions } from '../types/Dimensions.interface';
import { NextFitDecreasingHeight } from '../algorithms/strip/NextFitDecreasingHeight';
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from '../types/PackingAlgorithm.interface';
import { useStats } from './useStats';
import { FirstFitDecreasingHeight } from '../algorithms/strip/FirstFitDecreasingHeight';
import { BestFitDecreasingHeight } from '../algorithms/strip/BestFitDecreasingHeight';
import { SizeAlternatingStack } from '../algorithms/strip/SizeAlternatingStack';
import { DimensionsWithConfig } from '../types/DimensionsWithConfig.type';

const {
  BEST_FIT_DECREASING_HEIGHT,
  NEXT_FIT_DECREASING_HEIGHT,
  FIRST_FIT_DECREASING_HEIGHT,
  SIZE_ALTERNATING_STACK,
} = PackingAlgorithms;

export type AlgoStates = 'RUNNING' | 'STOPPED' | 'PAUSED';

export const usePackingAlgorithms = (
  size: Dimensions,
  selectedAlgorithm: PackingAlgorithms
) => {
  const { addArea, getStats } = useStats(size.width);
  const [algoState, setAlgoState] = useState<AlgoStates>('STOPPED');
  const [isFinished, setIsFinished] = useState(true);
  // TODO better typings than any :)
  const algorithm = useRef<PackingAlgorithm<{}, any>>(
    new NextFitDecreasingHeight(size)
  );

  const reset = useCallback(() => {
    setIsFinished(true);
    setAlgoState('STOPPED');
  }, []);

  const intializeOnStart = useCallback(() => {
    setIsFinished(false);
    setAlgoState('RUNNING');
  }, []);

  const pause = useCallback(() => {
    setAlgoState(prev => (prev === 'PAUSED' ? 'RUNNING' : 'PAUSED'));
  }, []);

  const place = useCallback(() => {
    if (algorithm.current.isFinished()) {
      reset();
      return null;
    }

    const rec = algorithm.current.place();
    addArea(rec);
    return rec;
  }, [addArea, algorithm, reset]);

  const start = useCallback(
    (data: DimensionsWithConfig<{}>[]) => {
      intializeOnStart();

      switch (selectedAlgorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          algorithm.current = new NextFitDecreasingHeight<{}>(size).load(data);
          break;

        case FIRST_FIT_DECREASING_HEIGHT:
          algorithm.current = new FirstFitDecreasingHeight<{}>(size).load(data);
          break;

        case BEST_FIT_DECREASING_HEIGHT:
          algorithm.current = new BestFitDecreasingHeight<{}>(size).load(data);
          break;

        case SIZE_ALTERNATING_STACK:
          algorithm.current = new SizeAlternatingStack<{}>(size).load(data);
          break;

        default:
          reset();
          console.error('unkown algorithm: ', selectedAlgorithm);
          break;
      }
    },
    [intializeOnStart, selectedAlgorithm, reset, size]
  );

  return { start, getStats, place, isFinished, algoState, pause, reset };
};
