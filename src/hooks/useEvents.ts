import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useScoreStore from '../store/score.store';
import { Events } from '../types/Events.enum';
import { PackingAlgorithms } from '../types/PackingAlgorithm.interface';
import { Levels } from '../types/Levels.enum';
import useLevelStore from '../store/level.store';

export const useEvents = (algo: PackingAlgorithms) => {
  const level = useLevelStore(useCallback(({level}) => level, []));
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const {setEndScore,setLastPlayed} = useScoreStore(useCallback(({ setEndScore,setLastPlayed }) => ({setLastPlayed, setEndScore}), []));

  const onPlaceEvent = useCallback(
    (dynInvLength: number) => {
      dynInvLength === 1 ? setEvent(Events.FINISHED) : setEvent(Events.RECT_PLACED);
    },
    [setEvent]
  );

  useEffect(() => {
    if(event === Events.FINISHED) {
      setEndScore(algo, level);
      setLastPlayed();
    }
  },[event, level])

  return { onPlaceEvent, setEvent, event };
};
