import { Levels } from '../types/enums/Levels.enum';
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
        time: 10, // 8 seconds
      };

    case Levels.EXPERT:
      return {
        allowDrag: false,
        time: 6, // 4 seconds
      };
  }
};
