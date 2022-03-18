import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import { Events } from '../types/Events.enum';

export const useEvents = () => {
  const setEvent = useEventStore(useCallback(({ setEvent }) => setEvent, []));

  const onPlaceEvent = useCallback((dynInvLength: number) => {
    dynInvLength === 1 ? setEvent(Events.FINISHED) : setEvent(Events.RECT_PLACED);
  },[setEvent])

  return { onPlaceEvent}
};
