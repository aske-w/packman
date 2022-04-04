import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useLevelStore from '../store/level.store';
import { Events } from '../types/enums/Events.enum';
import { Algorithm } from '../types/enums/AllAlgorithms.enum';

type Cb<T> = (t: T) => void;

export const useRestartStripPacking = <T extends Record<string, any> | undefined>(cbs: (Cb<T> | undefined)[], algorithm: Algorithm, context: T) => {
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const level = useLevelStore(useCallback(({ level }) => level, []));

  const reset = () => {
    setEvent(Events.IDLE);
    cbs.forEach(cb => cb?.(context));
  };

  useEffect(() => {
    switch (event) {
      case Events.RESTART:
        reset();
        break;

      default:
        break;
    }
  }, [event]);

  useEffect(() => {
    reset();
  }, [algorithm, level]);

  return reset;
};
