import React, { useCallback, useState } from 'react';
import { Dimensions } from '../types/Dimensions.interface';
import { NextFitDecreasingHeight } from '../algorithms/NextFitDecreasingHeight';
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from '../types/PackingAlgorithm.interface';
import { useStats } from './useStats';
import { FirstFitDecreasingHeight } from '../algorithms/FirstFitDecreasingHeight';

const { NEXT_FIT_DECREASING_HEIGHT, FIRST_FIT_DECREASING_HEIGHT } =
  PackingAlgorithms;

export const usePackingAlgorithms = (
  size: Dimensions,
  selectedAlgorithm: PackingAlgorithms,
  setDimensionStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>
) => {
  const { addArea, getStats } = useStats(size.width);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [algorithm, setAlgorithm] = useState<PackingAlgorithm>(
    () => new NextFitDecreasingHeight(size)
  );

  const reset = useCallback(() => {
    setIsFinished(false);
    setIsStarted(false);
    setDimensionStorage([]);
    algorithm.load([]);
  }, [algorithm, setDimensionStorage]);

  const place = useCallback(() => {
    if (algorithm.isFinished()) {
      setIsFinished(true);
      setIsStarted(false);
      return null;
    }

    const rec = algorithm.place();
    addArea(rec);
    return rec;
  }, [addArea, algorithm]);

  const start = useCallback(
    (data: Dimensions[]) => {
      setIsFinished(false);
      setIsStarted(true);
      switch (selectedAlgorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          {
            const algo = new NextFitDecreasingHeight(size).load(data);
            setAlgorithm(algo);
          }
          break;
        case FIRST_FIT_DECREASING_HEIGHT:
          {
            const algo = new FirstFitDecreasingHeight(size).load(data);
            setAlgorithm(algo);
          }
          break;

        default:
          console.error('unkown algorithm: ', selectedAlgorithm);
          setIsStarted(false);
          break;
      }
    },
    [selectedAlgorithm, size]
  );

  return { start, getStats, place, isFinished, reset, isStarted };
};
