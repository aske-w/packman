import React from 'react';
import { Link } from 'react-router-dom';
import { pathName } from './routes';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <ul className="space-y-10">
        <li>
          <Link
            className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900"
            to="playground/strip"
          >
            Strip packing Playground
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900" to="playground/bin">
            Bin packing Playground
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900" to="game/strip">
            Strip packing
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900" to="game/bin">
            Bin packing
          </Link>
        </li>
        <li>
          <Link
            className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900"
            to={pathName.ONLINE_STRIP_GAME}
          >
            Online Strip Packing
          </Link>
        </li>
        <li>
          <Link
            className="block px-4 py-2 font-medium text-center text-white bg-blue-700 rounded text-normal hover:bg-blue-900"
            to={pathName.ACHIEVEMENTS}
          >
            Your Achievements
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
