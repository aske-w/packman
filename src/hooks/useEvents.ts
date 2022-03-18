import { useCallback } from 'react';
import useEventStore from '../store/event.store';
import { Events } from '../types/Events.enum';

export const useEvents = () => {
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));

  const onPlaceEvent = useCallback(
    (dynInvLength: number) => {
      dynInvLength === 1 ? setEvent(Events.FINISHED) : setEvent(Events.RECT_PLACED);
    },
    [setEvent]
  );

  return { onPlaceEvent, setEvent, event };
};
