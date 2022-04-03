import React, { useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import useAchievementStore from '../store/achievement.store';
import useAlgorithmStore from '../store/algorithm.store';
import useEventStore from '../store/event.store';
import useGameStore from '../store/game.store';
import useLevelStore from '../store/level.store';
import useScoreStore from '../store/score.store';
import { Badges } from '../types/enums/Badges.enum';
import { BinPackingAlgorithm } from '../types/enums/BinPackingAlgorithm.enum';
import { Events } from '../types/enums/Events.enum';

interface BadgesProps {}

export const BadgeContainer: React.FC<BadgesProps> = ({}) => {
  const { event } = useEventStore(useCallback(({ event, setEvent }) => ({ event, setEvent }), []));
  // const { addGameResult } = useAchievementStore();
  const currentGame = useGameStore(useCallback(state => state.currentGame, []));
  const algorithm = useAlgorithmStore(useCallback(state => state.algorithm, []));
  const level = useLevelStore(useCallback(state => state.level, []));
  const addGameResult = useAchievementStore(useCallback(state => state.addGameResult, []));
  const user = useScoreStore(useCallback(state => state.user, []));

  useEffect(() => {
    if (!algorithm) return;

    switch (event) {
      case Events.FINISHED:
        console.log('Events.FINISHED');
        addGameResult(currentGame!, algorithm, level, user.height, true);
        break;
      case Events.GAME_OVER:
        console.log('Events.GAME_OVER');
        addGameResult(currentGame!, algorithm, level, user.height, false);
        break;
    }
  }, [event, currentGame, algorithm, level, user.height, addGameResult]);

  return (
    <div>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
      />
    </div>
  );
};

export const promptBadge = (x: Badges) => {
  toast(
    <div className="flex items-center">
      <span className="pr-3 text-3xl w-fit">🏅</span>
      <span className="w-fit">
        Badge '<span className="font-bold">{x}</span>' unlocked!
      </span>
    </div>
  );
};
