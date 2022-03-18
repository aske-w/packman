import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return <div className="text-center col-span-5 font-medium">{title}</div>;
};

export default Header;
