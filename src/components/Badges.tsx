import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Badges } from '../types/Badges.enum';

interface BadgesProps {}

export const BadgeContainer: React.FC<BadgesProps> = ({}) => {
  return (
    <div>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
      />
    </div>
  );
};

export const promptBadge = (x: Badges) => {
  toast(
    <div className="flex items-center">
      <span className="text-3xl w-fit pr-3">🏅</span>
      <span className="w-fit">
        Badge '<span className="font-bold">{x}</span>' unlocked!
      </span>
    </div>
  );
};
