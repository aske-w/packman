import classNames from 'classnames';
import React from 'react';

interface SideBarSectionProps {
  title: string;
  className?: string;
}

const SideBarSection: React.FC<SideBarSectionProps> = ({ title, className, children }) => {
  return (
    <>
      <div className={'bg-lightMain text-white px-3 py-2 '}>
        <label className="text-xs font-normal uppercase">{title}</label>
      </div>
      <div className={classNames('p-3 space-y-4', className)}>{children}</div>
    </>
  );
};

export default SideBarSection;
