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

export type AlgoStates = "RUNNING" | "STOPPED" | "PAUSED";

export const usePackingAlgorithms = (
  size: Dimensions,
  selectedAlgorithm: PackingAlgorithms
) => {
  const { addArea, getStats } = useStats(size.width);
  const [algoState, setAlgoState] = useState<AlgoStates>("STOPPED");
  const [isFinished, setIsFinished] = useState(true);
  const algorithm = useRef<PackingAlgorithm>(new NextFitDecreasingHeight(size));

  const reset = useCallback(() => {
    setIsFinished(true);
    setAlgoState("STOPPED");
  }, []);

  const intializeOnStart = useCallback(() => {
    setIsFinished(false);
    setAlgoState("RUNNING");
  }, []);

  const pause = useCallback(() => {
    setAlgoState((prev) => (prev === "PAUSED" ? "RUNNING" : "PAUSED"));
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
    (data: Dimensions[]) => {
      intializeOnStart();

      switch (selectedAlgorithm) {
        case NEXT_FIT_DECREASING_HEIGHT:
          algorithm.current = new NextFitDecreasingHeight(size).load(data);
          break;

        case FIRST_FIT_DECREASING_HEIGHT:
          algorithm.current = new FirstFitDecreasingHeight(size).load(data);
          break;

        default:
          reset();
          console.error("unkown algorithm: ", selectedAlgorithm);
          break;
      }
    },
    [intializeOnStart, selectedAlgorithm, reset, size]
  );

  return { start, getStats, place, isFinished, algoState, pause, reset };
};
