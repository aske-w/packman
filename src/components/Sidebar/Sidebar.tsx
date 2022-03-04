import React from 'react';

interface SidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

const Sidebar: React.FC<SidebarProps> = ({ className, style, children }) => {
  return (
    <div style={style} className={className + ' h-full bg-main'}>
      {children}
    </div>
  );
};

export default Sidebar;
