export enum Gamemodes {
  BIN_PACKING = 'Bin Packing',
  STRIP_PACKING = 'Strip Packing',
  ONLINE_STRIP_PACKING = 'Online Strip Packing',
}

export const ALL_GAMEMODES = [Gamemodes.BIN_PACKING, Gamemodes.STRIP_PACKING, Gamemodes.ONLINE_STRIP_PACKING];

export type PlaygroundGamemodes = Gamemodes.BIN_PACKING | Gamemodes.STRIP_PACKING