import create from 'zustand';
import { PackingAlgorithmEnum } from '../types/enums/OfflineStripPackingAlgorithm.enum';
import { OnlineStripPackingAlgorithmEnum } from '../types/enums/OnlineStripPackingAlgorithm.enum';

export interface AlgorithmState {
  readonly algorithm: PackingAlgorithmEnum;
  readonly onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum;
  setAlgorithm: (algorithm: PackingAlgorithmEnum) => void;
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum) => void;
}

const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  algorithm: PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT,
  onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF,
  setAlgorithm: (algorithm: PackingAlgorithmEnum) => set(state => ({ ...state, algorithm })),
  setOnlineStripPackingAlgorithm: (onlineStripPackingAlgorithm: OnlineStripPackingAlgorithmEnum) =>
    set(state => ({ ...state, onlineStripPackingAlgorithm })),
}));

export default useAlgorithmStore;
