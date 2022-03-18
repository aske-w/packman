import { useCallback, useEffect } from "react";
import useEventStore from "../store/event.store";
import { Events } from "../types/Events.enum";

export const useEvents = (startingInvLength: number, dynInvLength: number) => {
  const setEvent = useEventStore(useCallback(({ setEvent }) => setEvent, []));

  useEffect(() => {
    if (startingInvLength === dynInvLength + 1) {
      setEvent(Events.PLAYING);
    }

    if (dynInvLength === 0) {
      setEvent(Events.FINISHED);
    }
  }, [startingInvLength, dynInvLength]);
};
