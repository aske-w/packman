import React from 'react';
import { BadgesLocalStorage } from '../../../store/achievement.store';
import { Badges } from '../../../types/Badges.enum';

interface BadgeProps {
  badge: BadgesLocalStorage
}

const Badge: React.FC<BadgeProps> = ({badge}) => {
  return (
    <div className="bg-badge flex flex-col items-center justify-center text-white p-3 w-52 rounded-md hover:scale-105 ease-in-out duration-200 mr-3 mb-3">
      <span className="text-3xl w-fit pr-3 rounded-md">🏅</span>
      <h4 className="font-medium text-center">{badge.title}</h4>

      {/* <p className="w-full whitespace-nowrap text-xs font-thin text-gray-300 tracking-wide text-center">
        {badge.text}
      </p> */}

      <small className="text-xs text-gray-300 mt-8">
        {new Date(badge.date).toDateString()}
      </small>
    </div>
  );
};

export default Badge;
