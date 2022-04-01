import { useCallback, useRef, useState } from 'react';
import { BestFitDecreasingHeight } from '../algorithms/strip/BestFitDecreasingHeight';
import { FirstFitDecreasingHeight } from '../algorithms/strip/FirstFitDecreasingHeight';
import { NextFitDecreasingHeight } from '../algorithms/strip/NextFitDecreasingHeight';
import { SizeAlternatingStack } from '../algorithms/strip/SizeAlternatingStack';
import { Sleators } from '../algorithms/strip/Sleators';
import { DimensionsWithConfig } from '../types/DimensionsWithConfig.type';
import { PackingAlgorithmEnum } from '../types/enums/OfflineStripPackingAlgorithm.enum';
import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { useStats } from './useStats';

const { BEST_FIT_DECREASING_HEIGHT, NEXT_FIT_DECREASING_HEIGHT, FIRST_FIT_DECREASING_HEIGHT, SIZE_ALTERNATING_STACK, SLEATORS } =
  PackingAlgorithmEnum;

export type AlgoStates = 'RUNNING' | 'STOPPED' | 'PAUSED';

export const usePackingAlgorithms = (width: number, selectedAlgorithm: PackingAlgorithmEnum) => {
  const { addArea, getStats } = useStats(width);
  const [algoState, setAlgoState] = useState<AlgoStates>('STOPPED');
  const [isFinished, setIsFinished] = useState(true);
  // TODO better typings than any :)
  const algorithm = useRef<PackingAlgorithm<{}, {}, any>>(new NextFitDecreasingHeight({ width, height: 0 }));

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
      const size = { width, height: 0 };

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
        case SLEATORS:
          algorithm.current = new Sleators<{}>(size).load(data);
          break;

        default:
          reset();
          console.error('unkown algorithm: ', selectedAlgorithm);
          break;
      }
    },
    [intializeOnStart, selectedAlgorithm, reset, width]
  );

  return { start, getStats, place, isFinished, algoState, pause, reset };
};
