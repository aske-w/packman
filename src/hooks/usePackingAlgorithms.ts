import { useCallback, useRef, useState } from "react";
import { Dimensions } from "../types/Dimensions.interface";
import { NextFitDecreasingHeight } from "../algorithms/NextFitDecreasingHeight";
import {
  PackingAlgorithm,
  PackingAlgorithms,
} from "../types/PackingAlgorithm.interface";
import { useStats } from "./useStats";
import { FirstFitDecreasingHeight } from "../algorithms/FirstFitDecreasingHeight";

const { NEXT_FIT_DECREASING_HEIGHT, FIRST_FIT_DECREASING_HEIGHT } =
  PackingAlgorithms;

export type AlgoStates = "RUNNING" | "STOPPED";

export const usePackingAlgorithms = (
  size: Dimensions,
  selectedAlgorithm: PackingAlgorithms
) => {
  const { addArea, getStats } = useStats(size.width);
  const [algoState, setAlgoState] = useState<AlgoStates>("STOPPED");
  const [isFinished, setIsFinished] = useState(true);
  const algorithm = useRef<PackingAlgorithm>(new NextFitDecreasingHeight(size));

  const reset = useCallback(() => {
    setIsFinished(false);
  }, []);

  const place = useCallback(() => {
    if (algorithm.current.isFinished()) {
      setIsFinished(true);
      setAlgoState("STOPPED");
      return null;
    }

    const rec = algorithm.current.place();
    addArea(rec);
    return rec;
  }, [addArea, algorithm]);

  const start = useCallback(
    (data: Dimensions[]) => {
      reset();
      setAlgoState("RUNNING");

      switch (selectedAlgorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          {
            algorithm.current = new NextFitDecreasingHeight(size).load(data);
          }
          break;
        case FIRST_FIT_DECREASING_HEIGHT:
          {
            algorithm.current = new FirstFitDecreasingHeight(size).load(data);
          }
          break;

        default:
          console.error("unkown algorithm: ", selectedAlgorithm);
          break;
      }
    },
    [selectedAlgorithm, size, reset]
  );

  return { start, getStats, place, isFinished, algoState };
};
