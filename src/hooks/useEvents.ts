import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useScoreStore from '../store/score.store';
import { Events } from '../types/Events.enum';
import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
import useLevelStore from '../store/level.store';

export const useEvents = (algo: PackingAlgorithms) => {
  const level = useLevelStore(useCallback(({ level }) => level, []));
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const { setEndScore } = useScoreStore(useCallback(({ setEndScore }) => ({ setEndScore }), []));
  // const {  };

  const onPlaceEvent = useCallback(
    (dynInvLength: number) => {
      dynInvLength === 1 ? setEvent(Events.GAME_OVER) : setEvent(Events.RECT_PLACED);
    },
    [setEvent]
  );

  useEffect(() => {
    if (event === Events.FINISHED) {
      setEndScore(algo, level);
    }
  }, [event, level]);

  return { onPlaceEvent, setEvent, event };
};
