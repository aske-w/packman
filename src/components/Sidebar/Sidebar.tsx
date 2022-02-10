import React from "react";
import { useAutoPlace } from "../../hooks/useAutoPlace";
import { AlgoStates } from "../../hooks/usePackingAlgorithms";
import { useToggle } from "../../hooks/useToggle";
import { Dimensions } from "../../types/Dimensions.interface";
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from "../../types/PackingAlgorithm.interface";
import { genData } from "../Actions";
import AlgoSelect from "../AlgoSelect";
import SideBarItem from "./SidebarItem";
import SideBarSection from "./SideBarSection";
import Switch from "react-switch";
import ActionBtnSelector from "./ActionBtnSelector";
import RangeSlider from "../RangeSlider";
import BoxInput from "../BoxInput";

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

const Sidebar: React.FC<SidebarProps> = ({
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
  const isStarted = algoState === "RUNNING" || algoState === "PAUSED";

  console.log("algostate:", algoState);

  return (
    <div className="flex flex-row h-full">
      <div
        style={{ width, backgroundColor: "#232323" }}
        className="h-full bg-main overflow-hidden"
      >
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
              start: () => start(dimensionsStorage),
            }}
          />

          {checked && (
            <RangeSlider
              progress={speed}
              onChange={updateSpeed}
              className="mt-6"
            />
          )}
        </SideBarSection>

        <SideBarSection title="Automatic data set">
          <SideBarItem
            element={
              <button
                onClick={() => setDimensionsStorage(genData(40))}
                className={`px-2 py-1 font-medium text-white rounded shadow bg-blue-700 ${
                  isStarted ? "opacity-60" : "hover:bg-blue-800"
                }`}
                disabled={isStarted}
              >
                Generate data
              </button>
            }
            text="Generate data"
          />
        </SideBarSection>

        <SideBarSection
          title="Manuel data set"
          className="max-h-full overflow-y-scroll custom-scrollbar"
        >
          <BoxInput
            dimensionsStorage={dimensionsStorage}
            setDimensionsStorage={setDimensionsStorage}
            disabled={algoState === "RUNNING"}
          ></BoxInput>
        </SideBarSection>
        {/* <Actions {...props} /> */}
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
