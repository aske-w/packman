import React, { useCallback } from 'react';
import ReactJoyride from 'react-joyride';
import { Link, useLocation } from 'react-router-dom';
import { pathName, pathKey } from '../pages/routes';
import Logo from '../resources/Logo.svg';
import useAlgorithmStore from '../store/algorithm';
import useScoreStore from '../store/score';
import { ALL_PACKING_ALGORITHMS } from '../types/PackingAlgorithm.interface';
import AlgoSelect from './AlgoSelect';
import Score from './Score';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import useHelpStore from '../store/help.store';
interface NavProps {
  height: number;
}

const SHOW_ALGO_AND_SCORE = [pathName.STRIP_GAME];
const SHOW_PLAYGROUNDS = [pathName.BIN_PLAYGROUND, pathName.STRIP_PLAYGROUND];

const Nav: React.FC<NavProps> = ({ height, children }) => {
  const algorithm = useAlgorithmStore(
    useCallback(state => state.algorithm, [])
  );
  const setAlgorithm = useAlgorithmStore(
    useCallback(state => state.setAlgorithm, [])
  );
  const score = useScoreStore(
    useCallback(
      ({ algorithm, user, rectanglesLeft }) => ({
        user,
        algorithm,
        rectanglesLeft,
      }),
      []
    )
  );

  const { pathname } = useLocation();
  const { setIntroOpen } = useHelpStore();
  return (
    <div
      style={{
        height: `calc(100% - ${height}px)`,
        width: '100%',
      }}>
      <nav
        className="flex flex-row items-center justify-between w-full p-4 border-b border-gray-800 bg-main"
        style={{ height }}>
        <Link to="/">
          <div className="flex flex-row items-center justify-start h-full space-x-4">
            <img src={Logo} alt="logo" className="" />
            <h1 className="text-2xl font-medium text-white">Packman</h1>
          </div>
        </Link>

        {SHOW_PLAYGROUNDS.includes(pathname) && (
          <div className="flex flex-row items-center justify-between space-x-10 text-white">
            <Link
              to={pathName.STRIP_PLAYGROUND}
              className="text-sm cursor-pointer hover:text-gray-300">
              <label className="cursor-pointer">Strip playground</label>
            </Link>
            <Link
              to={pathName.BIN_PLAYGROUND}
              className="text-sm cursor-pointer hover:text-gray-300">
              <label className="cursor-pointer">Bin playground</label>
            </Link>
          </div>
        )}

        {SHOW_ALGO_AND_SCORE.includes(pathname) && (
          <>
            <ReactJoyride
              continuous
              steps={[
                {
                  target: '.user-score',
                  content: 'This is your score.',
                },
                {
                  target: '.algorithm-score',
                  content: 'This is the score of the algorithm.',
                },
                {
                  target: '.rects-left',
                  content:
                    'Here you can see how much of your inventory, you still need to pack.',
                },
                {
                  target: '.algorithm-select',
                  content:
                    'Here you can choose which algorithm you play against.',
                },
              ]}
            />
            <div className="flex flex-row items-center justify-between space-x-10 text-white">
              <div className="user-score">
                <Score
                  primary={`Height: ${score.user.height}`}
                  secondary="user"
                />
              </div>
              <div className="algorithm-score">
                <Score
                  primary={`Height: ${score.algorithm.height}`}
                  secondary="algorithm"
                />
              </div>
              <div className="rects-left">
                <Score primary={`Rects left: ${score.rectanglesLeft}`} />
              </div>

              <AlgoSelect
                className="text-base font-thin w-72 algorithm-select"
                options={ALL_PACKING_ALGORITHMS}
                value={algorithm}
                onChange={setAlgorithm}
              />
              <button onClick={() => setIntroOpen(true)}>
                <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
              </button>
            </div>
          </>
        )}
      </nav>
      {children}
    </div>
  );
};

export default Nav;
