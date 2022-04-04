import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { useCallback } from 'react';
import ReactJoyride from 'react-joyride';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import useAlgorithmStore from '../../store/algorithm.store';
import useHelpStore from '../../store/help.store';
import useScoreStore from '../../store/score.store';
import { ALL_PACKING_ALGORITHMS } from '../../types/enums/OfflineStripPackingAlgorithm.enum';
import Score from '../Score';
import LevelSelect from '../select/LevelSelect';
import Select from '../select/Select';
import DefaultNav from './DefaultNav';

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
            content: 'Here you can see how much of your inventory, you still need to pack.',
          },
          {
            target: '.algorithm-select',
            content: 'Here you can choose which algorithm you play against.',
          },
        ]}
      />
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
        <LevelSelect />
        <button onClick={() => setIntroOpen(true)}>
          <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
        </button>
      </div>
    </DefaultNav>
  );
};

export default StripPackingNav;
