import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useLevelStore from '../store/level.store';
import { Events } from '../types/enums/Events.enum';
import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';

type Cb = () => void;

export const useRestartStripPacking = (cbs: (Cb | undefined)[], algorithm: PackingAlgorithms) => {
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const level = useLevelStore(useCallback(({ level }) => level, []));

  const reset = () => {
    setEvent(Events.IDLE);
    cbs.forEach(cb => cb?.());
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
};
