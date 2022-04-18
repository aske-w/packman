import create from 'zustand';

interface PlaygroundState {
  animateRects: boolean;
  setAnimateRects(animateRects: boolean): void;
}

const usePlaygroundStore = create<PlaygroundState>(set => ({
  animateRects: true,
  setAnimateRects: animateRects => set(state => ({ ...state, animateRects })),
}));

export default usePlaygroundStore;
