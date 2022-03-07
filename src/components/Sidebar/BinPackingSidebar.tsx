import Switch from 'react-switch';
import React, { useRef, useState } from 'react';
import { useAutoPlace } from '../../hooks/useAutoPlace';
import { AlgoStates } from '../../hooks/usePackingAlgorithms';
import { useToggle } from '../../hooks/useToggle';
import {
  ALL_BIN_PACKING_ALGORITHMS,
  BinPackingAlgorithms,
} from '../../types/BinPackingAlgorithm.interface';
import { Dimensions } from '../../types/Dimensions.interface';
import { generateData } from '../../utils/generateData';
import AlgoSelect from '../AlgoSelect';
import BoxInput from '../BoxInput';
import RangeSlider from '../RangeSlider';
import RectInput from '../RectInput';
import ActionBtnSelector from './ActionBtnSelector';
import Sidebar from './Sidebar';
import SideBarItem from './SidebarItem';
import SideBarSection from './SideBarSection';

interface BinPackingSidebarProps<T = BinPackingAlgorithms> {
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
}

const SIDEBAR_WIDTH = 360;

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
}) => {
  const { checked, updateChecked } = useToggle();
  const { speed, updateSpeed } = useAutoPlace(checked, placeNext, algoState);
  const isStarted = algoState === 'RUNNING' || algoState === 'PAUSED';
  const [genNum, setGenNum] = useState(150);
  const [previousData, setPreviousData] = useState<Dimensions[]>([]);

  return (
    <Sidebar className="inline-flex flex-col overflow-hidden">
      <SideBarSection title="Algorithms">
        <AlgoSelect<BinPackingAlgorithms>
          className="text-base font-thin text-white w-72"
          options={ALL_BIN_PACKING_ALGORITHMS}
          onChange={setAlgorithm}
          value={algorithm}
          disabled={false}
        />
      </SideBarSection>
      <SideBarSection title="Actions panel">
        <SideBarItem
          element={
            <Switch
              color="#34C659"
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
              className="px-2 py-1 font-medium text-white bg-red-600 rounded shadow hover:bg-red-700"
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

      <SideBarSection title="Automatic data set" className="h-2/12">
        <SideBarItem
          element={
            <div className="flex items-center space-x-5 justify-right">
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
            <div className="flex items-center space-x-5 justify-right">
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
        className="flex flex-col p-0 overflow-hidden">
        <BoxInput
          dimensionsStorage={dimensionsStorage}
          setDimensionsStorage={setDimensionsStorage}
          disabled={algoState === 'RUNNING'}></BoxInput>
      </SideBarSection>
      {/* <Actions {...props} /> */}
    </Sidebar>
  );
};

export default BinPackingSidebar;
