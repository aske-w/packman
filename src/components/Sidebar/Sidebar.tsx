import React from 'react';

interface SidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

const Sidebar: React.FC<SidebarProps> = ({ className, style, children }) => {
  return (
    <div
      style={style}
      className={className + 'flex-shrink-0 h-full bg-main w-[360px]'}>
      {children}
    </div>
  );
};

export default Sidebar;
