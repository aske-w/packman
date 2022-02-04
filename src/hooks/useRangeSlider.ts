import React from "react";

export const useRangeSlider = () => {
  const [progress, setProgress] = React.useState(0);

  const updateProgress = (progress: number) => setProgress(progress);

  return { progress, updateProgress };
};
