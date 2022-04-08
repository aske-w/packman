import { useCallback } from 'react';
import useEventStore from '../store/event.store';
import useScoreStore from '../store/score.store';
import { Events } from '../types/enums/Events.enum';

export const useEvents = () => {
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const {
    user: userScore,
    algo: algoScore,
    rectanglesLeft,
  } = useScoreStore(useCallback(state => ({ rectanglesLeft: state.rectanglesLeft, user: state.user.height, algo: state.algorithm.height }), []));

  const dispatchEventOnPlace = useCallback(() => {
    if (rectanglesLeft - 1 === 0) {
      if (userScore >= algoScore) {
        setEvent(Events.FINISHED);
      } else {
        setEvent(Events.GAME_OVER);
      }
    } else {
      setEvent(Events.RECT_PLACED);
    }
  }, [rectanglesLeft, userScore, algoScore]);

  return { setEvent, event, dispatchEventOnPlace };
};
