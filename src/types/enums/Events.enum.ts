export enum Events {
  IDLE = 'idle',
  PLAYING = 'playing',
  /**
   *  Used when the user correctly places a rectangle in the game.
   */
  RECT_PLACED = 'rect_placed',
  RUNNING = 'running',
  RESTART = 'restart',
  OUT_OF_TIME = 'out_of_time',

  /**
   * When the game is finished, i.e. when the inventory is empty
   */
  FINISHED = 'finished',
  /**
   * Used when the user fails to meet an objective within set limits.
   */
  GAME_OVER = 'game_over',

  // Events to dispatch when player finishes a game mode to serve badges
  COMPLETED_BIN_PACKING = 'completed_bin_packing',
  COMPLEDED_STRIP_PACKING = 'completed_strip_packing',
}
