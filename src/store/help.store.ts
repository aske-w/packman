import create from 'zustand';

export interface HelpState {
  setIntroOpen: (open: boolean) => void;
  introOpen: boolean;
}

const useHelpStore = create<HelpState>(set => ({
  introOpen: true,
  setIntroOpen: open => set(state => ({ ...state, introOpen: open })),
}));

export default useHelpStore;
