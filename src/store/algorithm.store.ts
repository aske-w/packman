import create from 'zustand';
import { Algorithm } from '../types/enums/AllAlgorithms.enum';
export interface AlgorithmState {
  readonly algorithm: Algorithm | null;
  setAlgorithm: (algorithm: Algorithm | null) => void;
}

const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  algorithm: null,
  setAlgorithm: (algorithm: Algorithm | null) => set(state => ({ ...state, algorithm })),
}));

export default useAlgorithmStore;
