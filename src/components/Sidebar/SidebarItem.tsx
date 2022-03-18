import classNames from 'classnames';
import React from 'react';

interface SideBarItemProps {
  text: string;
  element: JSX.Element;
  className?: string;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ text, element, className }) => {
  return (
    <div className={classNames('w-full flex items-center justify-between', className)}>
      <label className="text-base font-normal tracking-wide text-white">{text}</label>
      {element}
    </div>
  );
};

export default SideBarItem;
