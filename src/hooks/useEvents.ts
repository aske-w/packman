import { useCallback, useEffect } from 'react';
import useEventStore from '../store/event.store';
import useLevelStore from '../store/level.store';
import useScoreStore from '../store/score.store';
import { Algorithm } from '../types/enums/AllAlgorithms.enum';
import { Events } from '../types/enums/Events.enum';

export const useEvents = (algo: Algorithm | null) => {
  const level = useLevelStore(useCallback(({ level }) => level, []));
  const { setEvent, event } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const {
    user: userScore,
    algo: algoScore,
    rectanglesLeft,
  } = useScoreStore(useCallback(state => ({ rectanglesLeft: state.rectanglesLeft, user: state.user.height, algo: state.algorithm.height }), []));

  const onPlaceEvent = useCallback(
    (interactiveLength: number, staticInvLength: number) => {
      if (event === Events.GAME_OVER || event === Events.FINISHED) return;

      if (interactiveLength !== staticInvLength) {
        setEvent(Events.RECT_PLACED);
      }
    },
    [setEvent, userScore, algoScore]
  );
  /**
   * Stops the game when it is done
   */
  useEffect(() => {
    if (rectanglesLeft === 0 && userScore === 0 && algoScore === 0) return;

    if (rectanglesLeft === 0) {
      if (userScore >= algoScore) {
        setEvent(Events.FINISHED);
      } else {
        setEvent(Events.GAME_OVER);
      }
    } else {
      setEvent(Events.RECT_PLACED);
    }
  }, [rectanglesLeft, userScore, algoScore]);

  return { onPlaceEvent, setEvent, event };
};
