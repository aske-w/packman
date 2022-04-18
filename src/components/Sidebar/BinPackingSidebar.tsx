import Switch from 'react-switch';
import React, { useEffect, useState } from 'react';
import { useAutoPlace } from '../../hooks/useAutoPlace';
import { AlgoStates } from '../../hooks/usePackingAlgorithms';
import { useToggle } from '../../hooks/useToggle';
import { ALL_BIN_PACKING_ALGORITHMS, BinPackingAlgorithm } from '../../types/enums/BinPackingAlgorithm.enum';
import { Dimensions } from '../../types/Dimensions.interface';
import { generateData } from '../../utils/generateData';
import Select from '../select/Select';
import BoxInput from '../BoxInput';
import RangeSlider from '../RangeSlider';
import RectInput from '../RectInput';
import ActionBtnSelector from './ActionBtnSelector';
import Sidebar from './Sidebar';
import SideBarItem from './SidebarItem';
import SideBarSection from './SideBarSection';
import classNames from 'classnames';
import LinkIcon from '@heroicons/react/solid/LinkIcon';
import TeachAlgoModal from '../playground/TeachAlgoModal';
import { AcademicCapIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import InputDesignerModal from './InputDesignerModal';

interface BinPackingSidebarProps<T = BinPackingAlgorithm> {
  setAlgorithm: React.Dispatch<React.SetStateAction<T>>;
  algorithm: T;

  isFinished: boolean;
  placeNext(): void;
  algoState: AlgoStates;
  start(data: Dimensions[]): void;
  dimensionsStorage: Dimensions[];
  setDimensionsStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>;
  reset(): void;
  pause(): void;
  setBinDimensions: React.Dispatch<React.SetStateAction<Dimensions>>;
  binDimensions: Dimensions;
}

const BinPackingSidebar: React.FC<BinPackingSidebarProps> = ({
  setAlgorithm,
  algorithm,
  algoState,
  dimensionsStorage,
  isFinished,
  pause,
  placeNext,
  reset,
  setDimensionsStorage,
  start,
  setBinDimensions,
  binDimensions,
}) => {
  const { checked, updateChecked } = useToggle();
  const { speed, updateSpeed } = useAutoPlace(checked, placeNext, algoState);
  const isStarted = algoState === 'RUNNING' || algoState === 'PAUSED';
  const [genNum, setGenNum] = useState(100);
  const [previousData, setPreviousData] = useState<Dimensions[]>([]);
  const [teachingOpen, setTeachingOpen] = useState(false);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [dimensionsLinked, setDimensionsLinked] = useState(false);
  const makeRndData = () => {
    setDimensionsStorage(generateData(genNum, 100, 10));
  };
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    makeRndData();
  }, []);
  return (
    <Sidebar className="inline-flex flex-col overflow-hidden">
      <TeachAlgoModal algorithm={algorithm} visible={teachingOpen} onClose={() => setTeachingOpen(false)} />
      <InputDesignerModal
        visible={designerOpen}
        onClose={() => setDesignerOpen(false)}
        existingRects={dimensionsStorage}
        setExistingRects={setDimensionsStorage}
        maxHeight={binDimensions.height}
        maxWidth={binDimensions.width}
      />

      <SideBarSection title="Algorithms">
        <div className="flex flex-row items-center justify-between">
          <Select<BinPackingAlgorithm>
            className="text-base font-thin text-white w-72 playground-algo-select"
            options={ALL_BIN_PACKING_ALGORITHMS}
            onChange={setAlgorithm}
            value={algorithm}
            disabled={false}
          />
          <button onClick={() => setTeachingOpen(true)}>
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </SideBarSection>
      <SideBarSection title="Actions panel">
        <SideBarItem
          className='playground-auto-place'
          element={<Switch color="#34C659" checked={checked} onChange={updateChecked} checkedIcon={false} uncheckedIcon={false} />}
          text="Auto place"
        />

        <SideBarItem
          className='playground-reset'
          element={
            <button className="px-2 py-1 font-medium text-white bg-red-600 rounded shadow hover:bg-red-700" onClick={reset}>
              Reset
            </button>
          }
          text="Reset"
        />

        <ActionBtnSelector
          {...{
            algoState,
            isAutoPlace: checked,
            pause,
            placeNext,
            disabled: isStarted,
            start: () => {
              setPreviousData(r => dimensionsStorage);
              start(dimensionsStorage);
            },
          }}
        />

        {checked && (
          <div className="flex flex-row items-center space-x-20">
            <RangeSlider progress={speed} onChange={updateSpeed} hideTooltip />
            <RectInput value={speed} className="w-4/12 px-3 select-none" sec="%" readonly />
          </div>
        )}
      </SideBarSection>
      <SideBarSection className={classNames({ 'opacity-50': algoState === 'RUNNING' })} title="Bin dimensions">
        <div className="flex flex-row items-center space-x-4 playground-dimensions">
          <RectInput
            disabled={isStarted}
            value={binDimensions.width}
            onChange={({ target: { value } }) => {
              const width = Number.parseInt(value || '1');
              setBinDimensions(old => {
                const ratio = old.height / old.width;
                return {
                  width,
                  height: Math.round(dimensionsLinked ? width * ratio : old.height),
                };
              });
            }}
            className="w-4/12 px-3 select-none"
            sec="w"
          />
          <RectInput
            value={binDimensions.height}
            onChange={({ target: { value } }) => {
              const height = Number.parseInt(value || '1');
              setBinDimensions(old => {
                const ratio = old.width / old.height;
                return {
                  height,
                  width: Math.round(dimensionsLinked ? height * ratio : old.width),
                };
              });
            }}
            className="w-4/12 px-3 select-none"
            sec="h"
            disabled={isStarted}
          />

          <LinkIcon
            data-tip="Link dimensions"
            className={classNames('h-5  cursor-pointer hover:text-gray-200 focus:outline-none', dimensionsLinked ? 'text-white' : 'text-gray-500')}
            onClick={() => {
              setDimensionsLinked(old => !old);
            }}
          />
        </div>
      </SideBarSection>

      <SideBarSection title="Automatic data set" className="h-2/12">
        <SideBarItem
          className='playground-auto-gen'
          element={
            <div className="flex items-center space-x-5 justify-right">
              <RectInput
                value={genNum}
                onChange={e => setGenNum(Number.parseInt(e.target.value))}
                className="w-4/12 px-3 select-none"
                disabled={isStarted}
              />
              <button
                onClick={makeRndData}
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${isStarted ? 'opacity-60' : 'hover:bg-blue-800'}`}
                disabled={isStarted}
              >
                Generate data
              </button>
            </div>
          }
          text="Generate data"
        />
        <SideBarItem
          className='playground-prev-data'
          text="Reuse previous data"
          element={
            <div className="flex items-center space-x-5 justify-right">
              <button
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${isStarted ? 'opacity-60' : 'hover:bg-blue-800'}`}
                onClick={() => setDimensionsStorage(r => previousData)}
              >
                Reuse previous data
              </button>
            </div>
          }
        />
        <SideBarItem
          className='playground-input-designer'
          text={'Advanced input design'}
          element={
            <button
              className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${isStarted ? 'opacity-60' : 'hover:bg-blue-800'}`}
              onClick={() => setDesignerOpen(true)}
            >
              Input designer
            </button>
          }
        />
      </SideBarSection>

      <SideBarSection title={'Data set (' + dimensionsStorage.length + ')'} className="flex flex-col p-0 overflow-hidden playground-test-data">
        <BoxInput dimensionsStorage={dimensionsStorage} setDimensionsStorage={setDimensionsStorage} disabled={algoState === 'RUNNING'}></BoxInput>
      </SideBarSection>
    </Sidebar>
  );
};

export default BinPackingSidebar;
