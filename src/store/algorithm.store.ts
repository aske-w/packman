import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
import create from 'zustand';

export interface AlgorithmState {
  algorithm: PackingAlgorithms;
  setAlgorithm: (algorithm: PackingAlgorithms) => void;
}

const useAlgorithmStore = create<AlgorithmState>(set => ({
  algorithm: PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT,
  setAlgorithm: (algorithm: PackingAlgorithms) => set(state => ({ ...state, algorithm })),
}));

export default useAlgorithmStore;
