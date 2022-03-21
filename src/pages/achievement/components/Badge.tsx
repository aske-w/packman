import React from 'react';
import { Badges } from '../../../types/Badges.enum';

interface BadgeProps {}

const Badge: React.FC<BadgeProps> = ({}) => {
  return (
    <div className="bg-badge flex flex-col items-center justify-center text-white p-3 w-52 rounded-md hover:scale-105 ease-in-out duration-200">
      <span className="text-3xl w-fit pr-3 rounded-md">🏅</span>
      <h4 className="font-medium">{Badges.ACHIEVED_FULL_POINTS}</h4>

      <p className="w-full whitespace-nowrap text-xs font-thin text-gray-300 tracking-wide text-center">Maximum effort</p>

      <small className="text-xs text-gray-300 mt-8">Apr 14, 2022</small>
    </div>
  );
};

export default Badge;
