import create from 'zustand';
import { persist } from './middleware/persist.middleware';

export interface HelpState {
  setIntroOpen: (open: boolean) => void;
  introOpen: boolean;
  dontShowAgain: boolean;
  setShowMsgAgain: () => void;
  playgroundJoyrideOpen: boolean;
  setPlaygroundJoyrideOpen: (value: boolean) => void;
  gamesJoyrideOpen: boolean;
  setGamesJoyrideOpen: (value: boolean) => void;
}

const useHelpStore = create<HelpState>(
  persist({ key: 'helpstore', allowlist: ['dontShowAgain',"playgroundJoyrideOpen", "gamesJoyrideOpen"] }, (set, get) => ({
    introOpen: get()?.dontShowAgain || false,
    setIntroOpen: open => set(state => ({ ...state, introOpen: open })),
    dontShowAgain: false,
    setShowMsgAgain: () =>
      set(state => ({
        ...state,
        dontShowAgain: !state.dontShowAgain,
      })),
    playgroundJoyrideOpen: get()?.playgroundJoyrideOpen || true,
    setPlaygroundJoyrideOpen: (value: boolean) => set(state => ({
      ...state, playgroundJoyrideOpen: value
    })),
    gamesJoyrideOpen: get()?.gamesJoyrideOpen || true,
    setGamesJoyrideOpen: (value: boolean) => set(state => ({
      ...state, gamesJoyrideOpen: value
    })),
  }))
);

export default useHelpStore;
