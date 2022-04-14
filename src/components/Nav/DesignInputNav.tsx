import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { useCallback, useState } from 'react';
import ReactJoyride from 'react-joyride';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import useAlgorithmStore from '../../store/algorithm.store';
import useEventStore from '../../store/event.store';
import useHelpStore from '../../store/help.store';
import useScoreStore from '../../store/score.store';
import { Dimensions } from '../../types/Dimensions.interface';
import { Events } from '../../types/enums/Events.enum';
import { ALL_PACKING_ALGORITHMS } from '../../types/enums/OfflineStripPackingAlgorithm.enum';
import Score from '../Score';
import LevelSelect from '../select/LevelSelect';
import ModeSelect, { Modes } from '../select/ModeSelect';
import Select from '../select/Select';
import InputDesignerModal from '../Sidebar/InputDesignerModal';
import DefaultNav from './DefaultNav';

interface DesignInputNavProps {
  start: () => void;
  rects: Dimensions[];
  setRects: (newRects: Dimensions[]) => void;
  startDisabled?: boolean;
  inputDesignerDisabled?: boolean;
  resetDisabled?: boolean
}

const StripPackingNav: React.FC<DesignInputNavProps> = ({rects, setRects, start, startDisabled = false, inputDesignerDisabled = false, resetDisabled = false}) => {
  const { setIntroOpen } = useHelpStore();
  const { setAlgorithm, algorithm } = useAlgorithmStore(useCallback(({ setAlgorithm, algorithm }) => ({ setAlgorithm, algorithm: algorithm }), []));
  const [showDesigner, setShowDesigner] = useState(false);
  const [mode, setMode] = useState<Modes>("Worst input");
  
  const { setEvent } = useEventStore(useCallback(({ setEvent }) => ({ setEvent }), []));
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
      <InputDesignerModal existingRects={rects} setExistingRects={setRects} visible={showDesigner} onClose={() => {setShowDesigner(false)}}/>
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
      <div className="flex flex-row items-center justify-between space-x-3 text-white">
        Level
        Persist result
        <button className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-400 border border-transparent rounded-md ${resetDisabled ? "opacity-60" : "hover:bg-red-500"} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
          onClick={() => {
            if(resetDisabled)
              return;
            setEvent(Events.RESTART)
          }}
          disabled={resetDisabled}
        >
          Reset
        </button>
        <button className={`inline-flex justify-center mr-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md ${startDisabled ? "opacity-60" : "hover:bg-blue-200"} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
          onClick={() => {
            if(startDisabled)
              return
            start()
          }}
          disabled={startDisabled}
        >
          Start
        </button>
        <button className={`inline-flex justify-center mr-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md ${inputDesignerDisabled ? "opacity-60" : "hover:bg-blue-200"} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
          onClick={() => {
            if(inputDesignerDisabled)
              return;
            setShowDesigner(true)
          }}
          disabled={inputDesignerDisabled}
        >
          Input designer
        </button>
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
        <ModeSelect value={mode} onChange={val => setMode(val)} />
        <LevelSelect />
        <button onClick={() => setIntroOpen(true)}>
          <QuestionMarkCircleIcon className="w-10 h-10 text-white hover:text-gray-200" />
        </button>
      </div>
    </DefaultNav>
  );
};

export default StripPackingNav;
