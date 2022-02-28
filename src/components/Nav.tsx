import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { pathName } from "../pages/routes";
import Logo from "../resources/Logo.svg";
import useAlgorithmStore from "../store/algorithm";
import useScoreStore from "../store/score";
import { ALL_PACKING_ALGORITHMS } from "../types/PackingAlgorithm.interface";
import AlgoSelect from "./AlgoSelect";

interface NavProps {
  height: number;
}

const SHOW_ALGO_AND_SCORE = [pathName.STRIP];

const Nav: React.FC<NavProps> = ({ height, children }) => {
  const algorithm = useAlgorithmStore(
    useCallback((state) => state.algorithm, [])
  );
  const setAlgorithm = useAlgorithmStore(
    useCallback((state) => state.setAlgorithm, [])
  );
  const score = useScoreStore(
    useCallback(({ algorithm, user }) => ({ user, algorithm }), [])
  );

  const { pathname } = useLocation();

  return (
    <div
      style={{
        height: `calc(100% - ${height}px)`,
        width: "100%",
      }}
    >
      <nav
        className="w-full p-4 border-b border-gray-800 bg-main flex flex-row items-center justify-between"
        style={{ height }}
      >
        <Link to="/">
          <div className="flex flex-row items-center justify-start h-full space-x-4">
            <img src={Logo} alt="logo" className="" />
            <h1 className="text-2xl font-medium text-white">Packman</h1>
          </div>
        </Link>

        {SHOW_ALGO_AND_SCORE.includes(pathname) && (
          <>
            <AlgoSelect
              className="w-72 text-white text-base font-thin"
              options={ALL_PACKING_ALGORITHMS}
              value={algorithm}
              onChange={setAlgorithm}
            />
          </>
        )}
      </nav>
      {children}
    </div>
  );
};

export default Nav;
