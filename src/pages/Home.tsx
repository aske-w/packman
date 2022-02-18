import React from "react";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <ul>
        <li>
          <Link
            className="px-4 py-2 font-medium text-white bg-blue-700 rounded text-normal hover:bg-blue-900"
            to="playground"
          >
            Playground
          </Link>
        </li>
        <li>
          <Link
            className="px-4 py-2 font-medium text-white bg-blue-700 rounded text-normal hover:bg-blue-900"
            to="game/strip"
          >
            Strip packing
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
