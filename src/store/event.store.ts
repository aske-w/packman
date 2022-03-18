import create from "zustand";
import { Events } from "../types/Events.interface";

export interface EventState {
  event: Events;
  setEvent: (event: Events) => void;
}

const useEventStore = create<EventState>((set) => ({
  event: Events.IDLE,
  setEvent: (event: Events) => set((state) => ({ ...state, event })),
}));

export default useEventStore;
