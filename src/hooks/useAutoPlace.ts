import React, { useEffect } from "react";
import { AlgoStates } from "./usePackingAlgorithms";

export const useAutoPlace = (
  shouldRun: boolean,
  place: () => void,
  algoState: AlgoStates
) => {
  useEffect(() => {
    let tid: NodeJS.Timeout | null = null;
    const go = () => {
      tid = setTimeout(() => {
        if (!shouldRun || algoState === "STOPPED") {
          return;
        }
        place();
        go();
      }, 10);
    };
    go();
    return () => {
      if (tid) clearTimeout(tid);
    };
  }, [shouldRun, algoState]);
};
