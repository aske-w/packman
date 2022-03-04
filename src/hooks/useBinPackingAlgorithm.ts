import { useCallback, useRef, useState } from 'react';
import FiniteNextFit from '../algorithms/bin/offline/FiniteNextFit';
import { NextFitDecreasingHeight } from '../algorithms/strip/NextFitDecreasingHeight';
import { BinPackingAlgorithms } from '../types/BinPackingAlgorithm.interface';
import { Dimensions } from '../types/Dimensions.interface';
import { DimensionsWithConfig } from '../types/DimensionsWithConfig.type';
import { PackingAlgorithm } from '../types/PackingAlgorithm.interface';
import { RectangleConfig } from '../types/RectangleConfig.interface';
import { useStats } from './useStats';

const { FINITE_NEXT_FIT } = BinPackingAlgorithms;

export type AlgoStates = 'RUNNING' | 'STOPPED' | 'PAUSED';

export const useBinPackingAlgorithm = (
  binSize: Dimensions,
  selectedAlgorithm: BinPackingAlgorithms
) => {
  const { addArea, getStats } = useStats(binSize.width);
  const [algoState, setAlgoState] = useState<AlgoStates>('STOPPED');
  const [isFinished, setIsFinished] = useState(true);
  // TODO better typings than any :)
  const algorithm = useRef<
    PackingAlgorithm<{}, RectangleConfig & { binId: number }>
  >(new NextFitDecreasingHeight(binSize));

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
    (data: DimensionsWithConfig[]) => {
      intializeOnStart();

      switch (selectedAlgorithm) {
        case FINITE_NEXT_FIT:
          algorithm.current = new FiniteNextFit(binSize).load(data);
          break;

        default:
          reset();
          console.error('unkown algorithm: ', selectedAlgorithm);
          break;
      }
    },
    [intializeOnStart, selectedAlgorithm, reset, binSize]
  );

  return { start, getStats, place, isFinished, algoState, pause, reset };
};
