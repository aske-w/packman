import create from 'zustand';
import { persist } from './middleware/persist.middleware';

export interface HelpState {
  setIntroOpen: (open: boolean) => void;
  introOpen: boolean;
  dontShowAgain: boolean;
  setShowMsgAgain: () => void;
  showPlaygroundIntro: boolean;
  setShowPlaygroundIntro: (value: boolean) => void;
}

const useHelpStore = create<HelpState>(
  persist({ key: 'helpstore', allowlist: ['dontShowAgain','showPlaygroundIntro'] }, (set, get) => ({
    introOpen: get()?.dontShowAgain || false,
    setIntroOpen: open => set(state => ({ ...state, introOpen: open })),
    dontShowAgain: false,
    setShowMsgAgain: () =>
    set(state => ({
      ...state,
      dontShowAgain: !state.dontShowAgain,
    })),
    showPlaygroundIntro: get()?.showPlaygroundIntro || true,
    setShowPlaygroundIntro: open => set(state => ({ ...state, showPlaygroundIntro: open })),
  }))
);

export default useHelpStore;
