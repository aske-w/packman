import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { useCallback } from 'react';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import useAlgorithmStore from '../../store/algorithm.store';
import useGameEndStore from '../../store/gameEnd.store';
import useHelpStore from '../../store/help.store';
import useScoreStore from '../../store/score.store';
import { ALL_ONLINE_STRIP_PACKING_ALGORITHMS, OnlineStripPackingAlgorithmEnum } from '../../types/enums/OnlineStripPackingAlgorithm.enum';
import Score from '../Score';
import LevelSelect from '../select/LevelSelect';
import Select from '../select/Select';
import DefaultNav from './DefaultNav';

interface OnlineStripPackingNavProps {}

const OnlineStripPackingNav: React.FC<OnlineStripPackingNavProps> = ({}) => {
  const { blur: showModal } = useGameEndStore();
  const { setIntroOpen } = useHelpStore();
  const { setAlgorithm, algorithm } = useAlgorithmStore(
    useCallback(({ setAlgorithm, algorithm }) => ({ setAlgorithm, algorithm: algorithm || OnlineStripPackingAlgorithmEnum.NEXT_FIT_SHELF }), [])
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

  return (
    <DefaultNav height={NAV_HEIGHT}>
      <div className="flex flex-row items-center justify-between space-x-10 text-white">
        <div className="user-score">
          <Score primary={`Height: ${score.user.height}`} secondary="user" />
        </div>
        <div className="algorithm-score">
          <Score primary={`Height: ${score.algorithm.height}`} secondary="algorithm" />
        </div>
        <div className="rects-left">
          <Score primary={`Rects left: ${score.rectanglesLeft}`} />
        </div>

        <Select
          className="text-base font-thin w-72 algorithm-select"
          options={ALL_ONLINE_STRIP_PACKING_ALGORITHMS}
          value={algorithm}
          onChange={setAlgorithm}
        />
        <LevelSelect />
        <button onClick={() => setIntroOpen(true)}>
          <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
        </button>
      </div>
    </DefaultNav>
  );
};

export default OnlineStripPackingNav;
