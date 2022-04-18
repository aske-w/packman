import create from 'zustand';
import { persist } from './middleware/persist.middleware';

export interface HelpState {
  setIntroOpen: (open: boolean) => void;
  introOpen: boolean;
  dontShowAgain: boolean;
  setShowMsgAgain: () => void;
  showPlaygroundIntro: boolean;
  setShowPlaygroundIntro: (value: boolean) => void;
  dontShowAgainOfflineStrip: boolean;
  setDontShowAgainOfflineStrip: (value: boolean) => void;
  dontShowAgainOnlineStrip: boolean;
  setDontShowAgainOnlineStrip: (value: boolean) => void;
  dontShowAgainOfflineBin: boolean;
  setDontShowAgainOfflineBin: (value: boolean) => void;
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
    dontShowAgainOfflineStrip: get()?.dontShowAgainOfflineStrip || false,
    setDontShowAgainOfflineStrip: value => set(state => ({ ...state, dontShowAgainOfflineStrip: value })),
    dontShowAgainOnlineStrip: get()?.dontShowAgainOnlineStrip || false,
    setDontShowAgainOnlineStrip: value => set(state => ({ ...state, dontShowAgainOnlineStrip: value })),
    dontShowAgainOfflineBin: get()?.dontShowAgainOfflineBin || false,
    setDontShowAgainOfflineBin: value => set(state => ({ ...state, dontShowAgainOfflineBin: value })),
  }))
);

export default useHelpStore;
