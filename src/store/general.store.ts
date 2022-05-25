import create from 'zustand';

export interface GeneralStore {
  numItems: number;
  setNumItems: (value: number) => void;
}

const useGeneralStore = create<GeneralStore>(set => ({
  numItems: 25,
  setNumItems: value => set({ numItems: value }),
}));

export default useGeneralStore;
