import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
import create from 'zustand';
import { BinPackingAlgorithm } from '../types/enums/BinPackingAlgorithm.enum';
import { OnlineStripPackingAlgorithmEnum } from '../types/enums/OnlineStripPackingAlgorithm.enum';

export interface AlgorithmState {
  readonly algorithm: PackingAlgorithms;
  readonly onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum;
  setAlgorithm: (algorithm: PackingAlgorithms) => void;
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum) => void;
}

const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  algorithm: PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT,
  onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF,
  setAlgorithm: (algorithm: PackingAlgorithms) => set(state => ({ ...state, algorithm })),
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum) =>
    set(state => ({ ...state, onlineStripPackingAlgorithm })),
}));

export default useAlgorithmStore;
