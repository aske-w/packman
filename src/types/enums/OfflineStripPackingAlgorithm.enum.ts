export enum PackingAlgorithmEnum {
  NEXT_FIT_DECREASING_HEIGHT = 'Next Fit Decreasing Height',
  FIRST_FIT_DECREASING_HEIGHT = 'First Fit Decreasing Height',
  BEST_FIT_DECREASING_HEIGHT = 'Best Fit Decreasing Height',
  SIZE_ALTERNATING_STACK = 'Size Alternating Stack',
  SLEATORS = 'Sleators',
  SLEATORS_OPTIMIZED = 'Sleators Optimized',
}

export const ALL_PACKING_ALGORITHMS = [
  PackingAlgorithmEnum.FIRST_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.BEST_FIT_DECREASING_HEIGHT,
  PackingAlgorithmEnum.SIZE_ALTERNATING_STACK,
  PackingAlgorithmEnum.SLEATORS,
  PackingAlgorithmEnum.SLEATORS_OPTIMIZED,
];
