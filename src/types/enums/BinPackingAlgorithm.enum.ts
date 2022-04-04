export enum BinPackingAlgorithm {
  FINITE_NEXT_FIT = 'Finite Next Fit',
  FINITE_FIRST_FIT = 'Finite First Fit',
  HYBRID_FIRST_FIT = 'Hybrid First Fit',
}

export const ALL_BIN_PACKING_ALGORITHMS = [
  BinPackingAlgorithm.FINITE_NEXT_FIT,
  BinPackingAlgorithm.FINITE_FIRST_FIT,
  BinPackingAlgorithm.HYBRID_FIRST_FIT,
];
