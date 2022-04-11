export enum Badges {
  // Imitation badges
  /**
   * when a user fails 100%
   */
  AT_LEAST_YOU_TRIED = 'At least you tried',
  /**
   * Imitation: Getting multiple perfect scores in a row
   */
  STREAK = 'Streak',
  /**
   * Imitation
   */
  SUCCESS_ON_FIRST_ATTEMPT = 'Success on first attempt',
  /**
   * Imitation
   */
  COMPLETED_AN_ALGORITHM = 'Completed an algorithm',
  /**
   * Imitation
   */
  ACHIEVED_FULL_POINTS = 'Achieved full points',
  IMITATED_ALL_ALGORITHMS = 'Imitated all algorithms',

  // Bin packing badges
  COMPETED_AGAINST_ALL_ALGORITHMS_BIN_PACKING = 'Competed against all bin packing algorithms',
  WON_AGAINST_ANY_ALGORITHM_BIN_PACKING = 'Scored better than any algorithm in bin packing',
  WON_AGAINST_ALL_ALGORITHM_BIN_PACKING = 'Scored better than all algorithms in bin packing',
  LOSE_AGAINST_ANY_ALGORITHM_BIN_PACKING = 'Scored worse than any algorithm in bin packing',
  LOSE_AGAINST_ALL_ALGORITHM_BIN_PACKING = 'Scored worse than all algorithms in bin packing',
  COMPLETE_ALL_ALGORITHMS_BEGINNER_BIN_PACKING = 'Won against all bin packing algorithms on beginner difficulty',
  COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_BIN_PACKING = 'Won against all bin packing algorithms on intermediate difficulty',
  COMPLETE_ALL_ALGORITHMS_EXPERT_BIN_PACKING = 'Won against all bin packing algorithms on expert difficulty',

  // Strip packing badges
  COMPETED_AGAINST_ALL_ALGORITHMS_STRIP_PACKING = 'Competed against all strip packing algorithms',
  WON_AGAINST_ANY_ALGORITHM_STRIP_PACKING = 'Scored better than any algorithm in strip packing',
  WON_AGAINST_ALL_ALGORITHM_STRIP_PACKING = 'Scored better than all algorithms in strip packing',
  LOSE_AGAINST_ANY_ALGORITHM_STRIP_PACKING = 'Scored worse than any algorithm in strip packing',
  LOSE_AGAINST_ALL_ALGORITHM_STRIP_PACKING = 'Scored worse than all algorithms in strip packing',
  COMPLETE_ALL_ALGORITHMS_BEGINNER_STRIP_PACKING = 'Won against all strip packing algorithms on beginner difficulty',
  COMPLETE_ALL_ALGORITHMS_INTERMEDIATE_STRIP_PACKING = 'Won against all strip packing algorithms on intermediate difficulty',
  COMPLETE_ALL_ALGORITHMS_EXPERT_STRIP_PACKING = 'Won against all strip packing algorithms on expert difficulty',
  // General badges
  COMPLETED_TUTORIAL = 'Completed tutorial',
  PLAYED_ALL_GAME_MODES = 'Played all game modes',
  /**
   * Win all game mode/algorithm combinations on beginner difficulty
   */
  LEARNING_THE_ROPES = 'Learning the ropes',
  /**
   * Win all game mode/algorithm combinations on intermediate difficulty
   */
  LOOK_MA_NO_HANDS = 'Look ma, no hands!',
  /**
   * Win all game mode/algorithm combinations on expert difficulty
   */
  CERTIFIED_EXPERT = 'Certified expert',
}

export const ALL_BADGES = Object.values(Badges);
