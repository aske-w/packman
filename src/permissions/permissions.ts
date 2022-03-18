import { Levels } from "../types/Levels.interface";

export const getPermissions = (level: Levels) => {
  switch (level) {
    case Levels.BEGINNER:
      break;
    case Levels.NOVICE:
      break;
    case Levels.EXPERT:
      break;

    default:
      console.error("unkown level: ", level);
      break;
  }
};
