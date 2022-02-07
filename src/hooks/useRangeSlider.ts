import React from "react";

export const useRangeSlider = (intial = 0, scale = 1) => {
  const [progress, setProgress] = React.useState(intial);

  const updateProgress = (progress: number) => setProgress(progress);

  return {
    progress: progress,
    updateProgress,
    scaledProgress: progress * scale,
  };
};
