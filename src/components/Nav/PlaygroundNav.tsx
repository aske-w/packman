import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import { pathName } from '../../pages/routes';
import useHelpStore from '../../store/help.store';
import DefaultNav from './DefaultNav';

interface PlaygroundNavProps {}

const PlaygroundNav: React.FC<PlaygroundNavProps> = ({}) => {
  const { setIntroOpen } = useHelpStore();

  return (
    <DefaultNav height={NAV_HEIGHT}>
      <div className="flex flex-row items-center justify-between space-x-10 text-white">
        <Link to={pathName.STRIP_PLAYGROUND} className="text-sm cursor-pointer hover:text-gray-300">
          <label className="cursor-pointer">Strip playground</label>
        </Link>
        <Link to={pathName.BIN_PLAYGROUND} className="text-sm cursor-pointer hover:text-gray-300">
          <label className="cursor-pointer">Bin playground</label>
        </Link>
        <button onClick={() => setIntroOpen(true)}>
          <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
        </button>
      </div>
    </DefaultNav>
  );
};

export default PlaygroundNav;
