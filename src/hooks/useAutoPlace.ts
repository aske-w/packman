import React, { useEffect } from 'react';
import { AlgoStates } from './usePackingAlgorithms';
import { useRangeSlider } from './useRangeSlider';

export const useAutoPlace = (shouldRun: boolean, place: () => void, algoState: AlgoStates) => {
  const SCALE_FACTOR = 10;
  const { progress: speed, updateProgress: updateSpeed, scaledProgress: scaledSpeed } = useRangeSlider(50, SCALE_FACTOR);

  useEffect(() => {
    let tid: NodeJS.Timeout | null = null;
    const go = () => {
      tid = setTimeout(() => {
        if (!shouldRun || algoState === 'STOPPED' || algoState === 'PAUSED') {
          return;
        }
        place();
        go();
      }, SCALE_FACTOR * 100 - scaledSpeed);
    };
    go();

    return () => {
      if (tid) clearTimeout(tid);
    };
  }, [shouldRun, algoState, scaledSpeed]);

  return { speed, updateSpeed };
};
