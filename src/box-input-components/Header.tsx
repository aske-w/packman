import React from 'react';

interface HeaderProps {
    title: string,
}

const Header: React.FC<HeaderProps> = ({title}) => {
  return <div className="text-center">{title}</div>;
};

export default Header;
