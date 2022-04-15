import React, { useEffect, useState } from 'react';
import { useAutoPlace } from '../../hooks/useAutoPlace';
import { AlgoStates } from '../../hooks/usePackingAlgorithms';
import { useToggle } from '../../hooks/useToggle';
import { Dimensions } from '../../types/Dimensions.interface';
import { ALL_PACKING_ALGORITHMS, PackingAlgorithmEnum } from '../../types/enums/OfflineStripPackingAlgorithm.enum';
import Select from '../select/Select';
import SideBarItem from './SidebarItem';
import SideBarSection from './SideBarSection';
import Switch from 'react-switch';
import ActionBtnSelector from './ActionBtnSelector';
import RangeSlider from '../RangeSlider';
import BoxInput from '../BoxInput';
import RectInput from '../RectInput';
import { generateData } from '../../utils/generateData';
import Sidebar from './Sidebar';
import TeachAlgoModal from '../playground/TeachAlgoModal';
import { AcademicCapIcon } from '@heroicons/react/solid';

interface SidebarProps {
  placeNext(): void;
  algoState: AlgoStates;
  start(data: Dimensions[]): void;
  selectedAlgorithm: PackingAlgorithmEnum;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<PackingAlgorithmEnum>>;
  dimensionsStorage: Dimensions[];
  setDimensionsStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>;
  reset(): void;
  pause(): void;
  setStripWidth: React.Dispatch<React.SetStateAction<number>>;
  stripWidth: number;
}

const StripPackingSidebar: React.FC<SidebarProps> = ({
  placeNext,
  start,
  setSelectedAlgorithm,
  selectedAlgorithm,
  dimensionsStorage,
  setDimensionsStorage,
  algoState,
  reset,
  pause,
  setStripWidth,
  stripWidth,
}) => {
  const { checked, updateChecked } = useToggle();
  const { speed, updateSpeed } = useAutoPlace(checked, placeNext, algoState);
  const isStarted = algoState === 'RUNNING' || algoState === 'PAUSED';
  const [genNum, setGenNum] = useState(30);
  const [previousData, setPreviousData] = useState<Dimensions[]>([]);
  const [teachingOpen, setTeachingOpen] = useState(false);
  const makeRndData = () => {
    setDimensionsStorage(generateData(genNum, stripWidth * 0.52, 5));
  };
  useEffect(() => {
    makeRndData();
  }, []);
  return (
    <Sidebar className="inline-flex flex-col overflow-hidden">
      <TeachAlgoModal algorithm={selectedAlgorithm} visible={teachingOpen} onClose={() => setTeachingOpen(false)} />
      <SideBarSection title="Algorithms">
        <div className="flex flex-row items-center justify-between">
          <Select<PackingAlgorithmEnum>
            className="text-base font-thin text-white w-72 strip-playground-algo-select"
            options={ALL_PACKING_ALGORITHMS}
            onChange={setSelectedAlgorithm}
            value={selectedAlgorithm}
            disabled={isStarted}
          />
          <button onClick={() => setTeachingOpen(true)}>
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </SideBarSection>

      <SideBarSection title="Actions panel">
        <SideBarItem
          className="strip-playground-auto-place"
          element={<Switch onColor="#34C659" checked={checked} onChange={updateChecked} checkedIcon={false} uncheckedIcon={false} />}
          text="Auto place"
        />

        <SideBarItem
          className="strip-playground-reset"
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
              // mapping is necessary, or else previousData and dimensionsStorage will use the same values
              setPreviousData(dimensionsStorage.map(d => {return {height: d.height, width: d.width}}));
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

      <SideBarSection title="Strip size">
        <div className="flex flex-row space-x-4 strip-playground-dimensions">
          <RectInput
            disabled={isStarted}
            value={stripWidth}
            onChange={({ target: { value } }) => setStripWidth(value ? Number.parseInt(value) : 0)}
            className="w-4/12 px-3 select-none"
            sec="w"
          />
        </div>
      </SideBarSection>

      <SideBarSection title="Automatic data set">
        <SideBarItem
          className="strip-playground-auto-gen"
          element={
            <div className="flex items-center space-x-5 justify-right">
              <RectInput
                disabled={isStarted}
                value={genNum}
                onChange={e => setGenNum(Number.parseInt(e.target.value))}
                className="w-4/12 px-3 select-none"
                sec=""
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
          text="Reuse previous data"
          className="strip-playground-prev-data"
          element={
            <div className="flex items-center space-x-5 justify-right">
              <button
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${isStarted ? 'opacity-60' : 'hover:bg-blue-800'}`}
                onClick={() => setDimensionsStorage(previousData)}
              >
                Reuse previous data
              </button>
            </div>
          }
        />
      </SideBarSection>

      <SideBarSection title={'Data set (' + dimensionsStorage.length + ')'} className="flex flex-col p-0 overflow-hidden strip-playground-test-data">
        <BoxInput dimensionsStorage={dimensionsStorage} setDimensionsStorage={setDimensionsStorage} disabled={algoState === 'RUNNING'}></BoxInput>
      </SideBarSection>
    </Sidebar>
  );
};

export default StripPackingSidebar;
