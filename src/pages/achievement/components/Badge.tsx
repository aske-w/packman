import React from 'react';
import { BadgesLocalStorage } from '../../../store/achievement.store';

interface BadgeProps {
  badge: BadgesLocalStorage | string;
  disabled?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ badge, disabled = false }) => {
  const isString = typeof badge === 'string';
  const title = isString ? badge : badge.title;
  return (
    <div
      className={
        (disabled ? ' opacity-50' : 'opacity-100 hover:scale-105') +
        ' relative bg-badge h-44 flex flex-col items-center justify-start text-white p-3 w-52 rounded-md ease-in-out duration-200 mr-3 mb-3'
      }
    >
      <span className="text-3xl w-fit pr-3 rounded-md">🏅</span>
      <h4 className="font-medium text-center">{title}</h4>

      {/* <p className="w-full whitespace-nowrap text-xs font-thin text-gray-300 tracking-wide text-center">
        {badge.text}
      </p> */}

      {!isString && <small className="absolute text-xs text-gray-300 bottom-3">{new Date(badge.date).toDateString()}</small>}
    </div>
  );
};

export default Badge;
