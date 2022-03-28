import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
import create from 'zustand';
import { BinPackingAlgorithms } from '../types/BinPackingAlgorithm.interface';
import { OnlineStripPacking, OnlineStripPackingAlgorithms } from '../types/OnlineStripPackingAlgorithm.interface';

export interface AlgorithmState {
  readonly algorithm: PackingAlgorithms;
  readonly onlineStripPackingAlgorithm: OnlineStripPackingAlgorithms;
  setAlgorithm: (algorithm: PackingAlgorithms) => void;
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithms) => void;
}

const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  algorithm: PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT,
  onlineStripPackingAlgorithm: OnlineStripPackingAlgorithms.NEXT_FIT_SHELF,
  setAlgorithm: (algorithm: PackingAlgorithms) => set(state => ({ ...state, algorithm })),
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithms) =>
    set(state => ({ ...state, onlineStripPackingAlgorithm })),
}));

export default useAlgorithmStore;
