import { useCallback, useState } from 'react';
import { Dimensions } from '../algorithms/Dimensions.interface';
import { NextFitDecreasingHeight } from '../algorithms/NextFitDecreasingHeight';
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from '../types/PackingAlgorithm.interface';
import { useStats } from './useStats';

const { NEXT_FIT_DECREASING_HEIGHT } = PackingAlgorithms;

export const usePackingAlgorithms = (
  size: Dimensions,
  selectedAlgorithm: PackingAlgorithms
) => {
  const { addArea, getStats } = useStats(size.width);

  const [isFinished, setIsFinished] = useState(false);
  const [algorithm, setAlgorithm] = useState<PackingAlgorithm>(
    () => new NextFitDecreasingHeight(size)
  );

  const reset = useCallback(() => {
    setIsFinished(false);
  }, []);

  const place = useCallback(() => {
    if (algorithm.isFinished()) {
      setIsFinished(true);
      return null;
    }

    const rec = algorithm.place();
    addArea(rec);
    return rec;
  }, [addArea, algorithm]);

  const start = useCallback(
    (data: Dimensions[]) => {
      reset();

      switch (selectedAlgorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          {
            const algo = new NextFitDecreasingHeight(size).load(data);

            setAlgorithm(algo);
          }

          break;

        default:
          console.error('unkown algorithm: ', selectedAlgorithm);
          break;
      }
    },
    [selectedAlgorithm, size, reset]
  );

  return { start, getStats, place, isFinished, reset };
};
