import React, { useState } from 'react';
import { useAutoPlace } from '../../hooks/useAutoPlace';
import { AlgoStates } from '../../hooks/usePackingAlgorithms';
import { useToggle } from '../../hooks/useToggle';
import { Dimensions } from '../../types/Dimensions.interface';
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from '../../types/PackingAlgorithm.interface';
import AlgoSelect from '../AlgoSelect';
import SideBarItem from './SidebarItem';
import SideBarSection from './SideBarSection';
import Switch from 'react-switch';
import ActionBtnSelector from './ActionBtnSelector';
import RangeSlider from '../RangeSlider';
import BoxInput from '../BoxInput';
import RectInput from '../RectInput';
import { generateData } from '../../utils/generateData';

interface SidebarProps {
  width: number;
  isFinished: boolean;
  placeNext(): void;
  algoState: AlgoStates;
  start(data: Dimensions[]): void;
  selectedAlgorithm: PackingAlgorithms;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<PackingAlgorithms>>;
  dimensionsStorage: Dimensions[];
  setDimensionsStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>;
  reset(): void;
  pause(): void;
}

const StripPackingSidebar: React.FC<SidebarProps> = ({
  width,
  children,
  isFinished,
  placeNext,
  start,
  setSelectedAlgorithm,
  selectedAlgorithm,
  dimensionsStorage,
  setDimensionsStorage,
  algoState,
  reset,
  pause,
}) => {
  const { checked, updateChecked } = useToggle();
  const { speed, updateSpeed } = useAutoPlace(checked, placeNext, algoState);
  const isStarted = algoState === 'RUNNING' || algoState === 'PAUSED';
  const [genNum, setGenNum] = useState(30);
  const [previousData, setPreviousData] = useState<Dimensions[]>([]);
  console.log('algostate:', algoState);

  return (
    <div className="flex flex-row h-full">
      <div
        style={{ width, backgroundColor: '#232323' }}
        className="h-full bg-main overflow-hidden">
        <SideBarSection title="Algorithms">
          <AlgoSelect
            className="w-72 text-white text-base font-thin"
            options={ALL_PACKING_ALGORITHMS}
            onChange={setSelectedAlgorithm}
            value={selectedAlgorithm}
            disabled={isStarted}
          />
        </SideBarSection>

        <SideBarSection title="Actions panel">
          <SideBarItem
            element={
              <Switch
                onColor="#34C659"
                checked={checked}
                onChange={updateChecked}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            }
            text="Auto place"
          />

          <SideBarItem
            element={
              <button
                className="px-2 py-1 font-medium text-white rounded shadow bg-red-600 hover:bg-red-700"
                onClick={reset}>
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
            <div className="flex flex-row space-x-20">
              <RangeSlider
                progress={speed}
                onChange={updateSpeed}
                className="mt-6"
                hideTooltip
              />
              <RectInput
                value={speed}
                className="w-4/12 px-3 select-none"
                sec="%"
                readonly
              />
            </div>
          )}
        </SideBarSection>

        <SideBarSection title="Automatic data set">
          <SideBarItem
            element={
              <div className="flex items-center justify-right space-x-5">
                <RectInput
                  value={genNum}
                  onChange={e => setGenNum(Number.parseInt(e.target.value))}
                  className="w-4/12 px-3 select-none"
                  sec=""
                />
                <button
                  onClick={() => setDimensionsStorage(generateData(genNum))}
                  className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${
                    isStarted ? 'opacity-60' : 'hover:bg-blue-800'
                  }`}
                  disabled={isStarted}>
                  Generate data
                </button>
              </div>
            }
            text="Generate data"
          />
          <SideBarItem
            text="Reuse previous data"
            element={
              <div className="flex items-center justify-right space-x-5">
                <button
                  className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${
                    isStarted ? 'opacity-60' : 'hover:bg-blue-800'
                  }`}
                  onClick={() => setDimensionsStorage(r => previousData)}>
                  Reuse previous data
                </button>
              </div>
            }
          />
        </SideBarSection>

        <SideBarSection
          title={'Manuel data set (' + dimensionsStorage.length + ')'}
          className="max-h-full overflow-y-scroll custom-scrollbar">
          <BoxInput
            dimensionsStorage={dimensionsStorage}
            setDimensionsStorage={setDimensionsStorage}
            disabled={algoState === 'RUNNING'}></BoxInput>
        </SideBarSection>
        {/* <Actions {...props} /> */}
      </div>
      {children}
    </div>
  );
};

export default StripPackingSidebar;
