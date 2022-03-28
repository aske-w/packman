import { Levels } from '../types/Levels.enum';
import { Permission } from '../types/Permission.interface';

export const getPermissions = (level: Levels): Permission => {
  switch (level) {
    case Levels.BEGINNER:
      return {
        allowDrag: true,
      };

    case Levels.NOVICE:
      return {
        allowDrag: true,
        time: 8, // 8 seconds
      };

    case Levels.EXPERT:
      return {
        allowDrag: false,
        time: 4, // 4 seconds
      };
  }
};
