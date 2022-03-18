import { useCallback, useState } from 'react';
import { Rectangle } from '../types/Rectangle.interface';

export const useStats = (canvasWidth: number) => {
  const [areaFilled, setAreaFilled] = useState(0);

  const addArea = useCallback((rec: Rectangle) => setAreaFilled(prev => prev + rec.width * rec.height), []);

  const getStats = (canvasHeight: number) => {
    const gameArea = canvasWidth * canvasHeight;
    const numbers = gameArea - areaFilled;
    const percentage = (areaFilled / gameArea) * 100;

    return { percentage, numbers };
  };

  const reset = useCallback(() => {
    setAreaFilled(0);
  }, []);

  return { addArea, getStats, reset };
};
