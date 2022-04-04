import { useCallback, useEffect } from "react";
import useEventStore from "../store/event.store";
import useGameStore from "../store/game.store";
import useLevelStore from "../store/level.store";
import { Events } from "../types/enums/Events.enum";
import { Levels } from "../types/enums/Levels.enum";

export const useGameEnded = (): () => boolean | undefined => {
  const { hasFinished, setHasFinished } = useGameStore();
  const { event } = useEventStore();
  const { level } = useLevelStore();

  useEffect(() => {
    if (event === Events.GAME_OVER || event == Events.FINISHED)
      setHasFinished(true);
  }, [event]);

  return useCallback(() => {
    console.log({hasFinished});
    if(hasFinished && level !== Levels.BEGINNER)
      setHasFinished(false);
    return hasFinished && level !== Levels.BEGINNER;
  }, [hasFinished, level])
}