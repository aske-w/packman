import React, { useState } from "react";
import { useAutoPlace } from "../../hooks/useAutoPlace";
import { AlgoStates } from "../../hooks/usePackingAlgorithms";
import { useToggle } from "../../hooks/useToggle";
import { Dimensions } from "../../types/Dimensions.interface";
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from "../../types/PackingAlgorithm.interface";
import AlgoSelect from "../AlgoSelect";
import SideBarItem from "./SidebarItem";
import SideBarSection from "./SideBarSection";
import Switch from "react-switch";
import ActionBtnSelector from "./ActionBtnSelector";
import RangeSlider from "../RangeSlider";
import BoxInput from "../BoxInput";
import RectInput from "../RectInput";
import { generateData } from "../../utils/generateData";
import Sidebar from "./Sidebar";

interface SidebarProps {
  placeNext(): void;
  algoState: AlgoStates;
  start(data: Dimensions[]): void;
  selectedAlgorithm: PackingAlgorithms;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<PackingAlgorithms>>;
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
  const isStarted = algoState === "RUNNING" || algoState === "PAUSED";
  const [genNum, setGenNum] = useState(30);
  const [previousData, setPreviousData] = useState<Dimensions[]>([]);

  return (
    <Sidebar className="inline-flex flex-col overflow-hidden">
      <SideBarSection title="Algorithms">
        <AlgoSelect<PackingAlgorithms>
          className="text-base font-thin text-white w-72"
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
              className="px-2 py-1 font-medium text-white bg-red-600 rounded shadow hover:bg-red-700"
              onClick={reset}
            >
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
              setPreviousData((r) => dimensionsStorage);
              start(dimensionsStorage);
            },
          }}
        />

        {checked && (
          <div className="flex flex-row space-x-20 items-center">
            <RangeSlider progress={speed} onChange={updateSpeed} hideTooltip />
            <RectInput
              value={speed}
              className="w-4/12 px-3 select-none"
              sec="%"
              readonly
            />
          </div>
        )}
      </SideBarSection>

      <SideBarSection title="Bin dimensions">
        <div className="flex flex-row space-x-4">
          <RectInput
            disabled={isStarted}
            value={stripWidth}
            onChange={({ target: { value } }) =>
              setStripWidth(value ? Number.parseInt(value) : 0)
            }
            className="w-4/12 px-3 select-none"
            sec="w"
          />
        </div>
      </SideBarSection>

      <SideBarSection title="Automatic data set">
        <SideBarItem
          element={
            <div className="flex items-center space-x-5 justify-right">
              <RectInput
                disabled={isStarted}
                value={genNum}
                onChange={(e) => setGenNum(Number.parseInt(e.target.value))}
                className="w-4/12 px-3 select-none"
                sec=""
              />
              <button
                onClick={() => setDimensionsStorage(generateData(genNum))}
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${
                  isStarted ? "opacity-60" : "hover:bg-blue-800"
                }`}
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
          element={
            <div className="flex items-center space-x-5 justify-right">
              <button
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${
                  isStarted ? "opacity-60" : "hover:bg-blue-800"
                }`}
                onClick={() => setDimensionsStorage((r) => previousData)}
              >
                Reuse previous data
              </button>
            </div>
          }
        />
      </SideBarSection>

      <SideBarSection
        title={"Manuel data set (" + dimensionsStorage.length + ")"}
        className="flex flex-col p-0 overflow-hidden"
      >
        <BoxInput
          dimensionsStorage={dimensionsStorage}
          setDimensionsStorage={setDimensionsStorage}
          disabled={algoState === "RUNNING"}
        ></BoxInput>
      </SideBarSection>
      {/* <Actions {...props} /> */}
    </Sidebar>
  );
};

export default StripPackingSidebar;