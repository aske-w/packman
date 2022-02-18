import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../resources/Logo.svg';

interface NavProps {
  height: number;
}

const Nav: React.FC<NavProps> = ({ height, children }) => {
  return (
    <div
      style={{
        height: `calc(100% - ${height}px)`,
        width: '100%',
      }}>
      <nav
        className="w-full p-4 border-b border-gray-800  bg-main"
        style={{ height }}>
        <Link to="/">
          <div className="flex flex-row items-center justify-start h-full space-x-4">
            <img src={Logo} alt="logo" className="" />
            <h1 className="text-2xl font-medium text-white">Packman</h1>
          </div>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Nav;
