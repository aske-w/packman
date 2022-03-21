import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Badges } from '../types/Badges.enum';

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
      - every time event COMPLETED_BIN_PACKING is dispatched, check algorithm/game mode combinations
    WON_AGAINST_ANY_ALGORITHM_BIN_PACKING
      - events FINISHED && COMPLETED_BIN_PACKING
    WON_AGAINST_ALL_ALGORITHM_BIN_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_BIN_PACKING is dispatched, check algorithm/game mode combinations
    LOSE_AGAINST_ANY_ALGORITHM_BIN_PACKING
      - events GAME_OVER && COMPLETED_BIN_PACKING
    LOSE_AGAINST_ALL_ALGORITHM_BIN_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_BIN_PACKING is dispatched, check algorithm/game mode combinations
    COMPLETE_ALL_ALGORITHMS_BEGINNER_BIN_PACKING
    COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_BIN_PACKING
    COMPLETE_ALL_ALGORITHMS_EXPERT_BIN_PACKING


    COMPETED_AGAINST_ALL_ALGORITHMS_STRIP_PACKING
      - save the algorithm/game mode combinations the user has completed
      - every time event COMPLETED_STRIP_PACKING is dispatched, check algorithm/game mode combinations
    WON_AGAINST_ANY_ALGORITHM_STRIP_PACKING
      - events FINISHED && COMPLETED_STRIP_PACKING
    WON_AGAINST_ALL_ALGORITHM_STRIP_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_STRIP_PACKING is dispatched, check algorithm/game mode combinations
    LOSE_AGAINST_ANY_ALGORITHM_STRIP_PACKING
      - events GAME_OVER && COMPLETED_STRIP_PACKING
    LOSE_AGAINST_ALL_ALGORITHM_STRIP_PACKING
      - save the algorithm/game mode/result combinations the user has completed
      - every time event COMPLETED_STRIP_PACKING is dispatched, check algorithm/game mode combinations
    COMPLETE_ALL_ALGORITHMS_BEGINNER_STRIP_PACKING
    COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_STRIP_PACKING
    COMPLETE_ALL_ALGORITHMS_EXPERT_STRIP_PACKING


    COMPLETED_TUTORIAL
    PLAYED_ALL_GAME_MODES
      - events COMPLETED_BIN_PACKING && COMPLEDED_STRIP_PACKING
    LEARNING_THE_ROPES
    LOOK_MA_NO_HANDS
    CERTIFIED_EXPERT
  */
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
