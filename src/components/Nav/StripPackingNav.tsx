import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { useCallback } from 'react';
import ReactJoyride from 'react-joyride';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import useAlgorithmStore from '../../store/algorithm.store';
import useHelpStore from '../../store/help.store';
import useScoreStore from '../../store/score.store';
import { ALL_PACKING_ALGORITHMS } from '../../types/enums/OfflineStripPackingAlgorithm.enum';
import { Gamemodes } from '../../types/Gamemodes.enum';
import Score from '../Score';
import LevelSelect from '../select/LevelSelect';
import Select from '../select/Select';
import DefaultNav from './DefaultNav';
import NavJoyride from './NavJoyride';

interface StripPackingNavProps {}

const StripPackingNav: React.FC<StripPackingNavProps> = ({}) => {
  const { setIntroOpen } = useHelpStore();
  const { setAlgorithm, algorithm } = useAlgorithmStore(useCallback(({ setAlgorithm, algorithm }) => ({ setAlgorithm, algorithm: algorithm }), []));
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

  return (
    <DefaultNav height={NAV_HEIGHT}>
      <NavJoyride gamemode={Gamemodes.STRIP_PACKING} />
      <div className="flex flex-row items-center justify-between space-x-10 text-white">
        <div className="user-score">
          <Score primary={`Score: ${score.user.height}`} secondary="You" />
        </div>
        <div className="algorithm-score">
          <Score primary={`Score: ${score.algorithm.height}`} secondary="Algorithm" />
        </div>
        <div className="rects-left">
          <Score primary={`Items left: ${score.rectanglesLeft}`} />
        </div>

        {algorithm && (
          <Select className="text-base font-thin w-72 algorithm-select" options={ALL_PACKING_ALGORITHMS} value={algorithm} onChange={setAlgorithm} />
        )}
        <LevelSelect className='level-select'/>
        <button onClick={() => setIntroOpen(true)}>
          <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
        </button>
      </div>
    </DefaultNav>
  );
};

export default StripPackingNav;
