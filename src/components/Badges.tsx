import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import useEventStore from '../store/event.store';
import { Badges } from '../types/Badges.enum';
import { Events } from '../types/Events.enum';

interface BadgesProps {}

export const BadgeContainer: React.FC<BadgesProps> = ({}) => {
  /*
    AT_LEAST_YOU_TRIED
    STREAK
    SUCCESS_ON_FIRST_ATTEMPT
    COMPLETED_AN_ALGORITHM
    ACHIEVED_FULL_POINTS
    IMITATED_ALL_ALGORITHMS

    COMPETED_AGAINST_ALL_ALGORITHMS_BIN_PACKING
      - save the algorithm/game mode combinations the user has completed
      - every time event FINISHED || GAME_OVER is dispatched, check algorithm/game mode combinations
    WON_AGAINST_ANY_ALGORITHM_BIN_PACKING
      - events FINISHED and check algorithm/game mode/result
    WON_AGAINST_ALL_ALGORITHM_BIN_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event FINISHED || GAME_OVER is dispatched, check algorithm/game mode/result combinations
    LOSE_AGAINST_ANY_ALGORITHM_BIN_PACKING
      - events GAME_OVER and check algorithm/game mode/result
    LOSE_AGAINST_ALL_ALGORITHM_BIN_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event FINISHED || GAME_OVER is dispatched, check algorithm/game mode combinations
    COMPLETE_ALL_ALGORITHMS_BEGINNER_BIN_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for bin packing
    COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_BIN_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for bin packing
    COMPLETE_ALL_ALGORITHMS_EXPERT_BIN_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for bin packing


    COMPETED_AGAINST_ALL_ALGORITHMS_STRIP_PACKING
      - save the algorithm/game mode combinations the user has completed
      - every time event FINISHED || GAME_OVER is dispatched, check algorithm/game mode combinations
    WON_AGAINST_ANY_ALGORITHM_STRIP_PACKING
      - events FINISHED
    WON_AGAINST_ALL_ALGORITHM_STRIP_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_STRIP_PACKING is dispatched, check algorithm/game mode combinations
    LOSE_AGAINST_ANY_ALGORITHM_STRIP_PACKING
      - events GAME_OVER
    LOSE_AGAINST_ALL_ALGORITHM_STRIP_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_STRIP_PACKING is dispatched, check algorithm/game mode combinations
    COMPLETE_ALL_ALGORITHMS_BEGINNER_STRIP_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for strip packing
    COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_STRIP_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for strip packing
    COMPLETE_ALL_ALGORITHMS_EXPERT_STRIP_PACKING
      - save game mode/algorithm/level and check if all exists with beginner level for strip packing


    COMPLETED_TUTORIAL
    PLAYED_ALL_GAME_MODES
      - events COMPLETED_BIN_PACKING && COMPLEDED_STRIP_PACKING
    LEARNING_THE_ROPES
      - save game mode/algorithm/level and check if all exists with beginner level
    LOOK_MA_NO_HANDS
      - save game mode/algorithm/level and check if all exists with intermediate level
    CERTIFIED_EXPERT
      - save game mode/algorithm/level and check if all exists with expert level
  */
  const { event } = useEventStore();

  useEffect(() => {
    switch (event) {
      case Events.FINISHED:
        break;
      case Events.GAME_OVER:
        break;
    }
  }, [event]);

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
      <span className="text-3xl w-fit pr-3">🏅</span>
      <span className="w-fit">
        Badge '<span className="font-bold">{x}</span>' unlocked!
      </span>
    </div>
  );
};
