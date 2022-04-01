import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../resources/Logo.svg';
import classNames from 'classnames';

interface DefaultNavProps {
  height: number;
  className?: string;
}

const DefaultNav: React.FC<DefaultNavProps> = ({ height, className, children }) => {
  return (
    <nav
      style={{ height }}
      className={classNames(className, 'flex flex-row items-center justify-between w-full p-4 border-b border-gray-800 bg-main')}
    >
      <Link to="/">
        <div className="flex flex-row items-center justify-start h-full space-x-4">
          <img src={Logo} alt="logo" className="" />
          <h1 className="text-2xl font-medium text-white">Packman</h1>
        </div>
      </Link>

      {children}
    </nav>
  );
};

export default DefaultNav;
