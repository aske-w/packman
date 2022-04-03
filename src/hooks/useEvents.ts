import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useLevelStore from '../store/level.store';
import useScoreStore from '../store/score.store';
import { Algorithm } from '../types/enums/AllAlgorithms.enum';
import { Events } from '../types/enums/Events.enum';

export const useEvents = (algo: Algorithm | null) => {
  const level = useLevelStore(useCallback(({ level }) => level, []));
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const { setEndScore } = useScoreStore(useCallback(({ setEndScore }) => ({ setEndScore }), []));
  const { user: userScore, algo: algoScore } = useScoreStore(useCallback(state => ({ user: state.user.height, algo: state.algorithm.height }), []));

  const onPlaceEvent = useCallback(
    (interactiveLength: number, staticInvLength: number) => {
      if (interactiveLength === staticInvLength) {
        if (userScore <= algoScore) {
          setEvent(Events.FINISHED);
        } else {
          setEvent(Events.GAME_OVER);
        }
      } else {
        setEvent(Events.RECT_PLACED);
      }
    },
    [setEvent, userScore, algoScore]
  );

  useEffect(() => {
    if (event === Events.FINISHED && algo) {
      setEndScore(algo, level);
    }
  }, [event, level]);

  return { onPlaceEvent, setEvent, event };
};
