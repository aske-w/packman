import { Levels } from "../types/Levels.enum";
import { Permission } from "../types/Permission.interface";

export const getPermissions = (level: Levels): Permission => {
  switch (level) {
    case Levels.BEGINNER:
      return {
        allowDrag: true,
      };
    case Levels.NOVICE:
      return {
        allowDrag: true,
        time: 1000 * 30, // 30 seconds
      };
    case Levels.EXPERT:
      return {
        allowDrag: false,
        time: 1000 * 15, // 15 seconds
      };
  }
};
