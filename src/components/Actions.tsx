import React from "react";
import { useToggle } from "../hooks/useToggle";
import RangeSlider from "./RangeSlider";
import Switch from "react-switch";
import { Dimensions } from "../types/Dimensions.interface";
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from "../types/PackingAlgorithm.interface";
import Select from "./select/Select";
import { useAutoPlace } from "../hooks/useAutoPlace";
import { AlgoStates } from "../hooks/usePackingAlgorithms";
import Card from "./Card";
import { generateData } from "../utils/generateData";

interface Props {
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

const Actions: React.FC<Props> = ({
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
  const isStarted = algoState === "RUNNING";

  return (
    <Card className="p-3 flex flex-col bg-slate-200 space-y-4">
      <div className="flex flex-row space-x-4 items-center justify-center">
        <Select
          options={ALL_PACKING_ALGORITHMS}
          onChange={setSelectedAlgorithm}
          value={selectedAlgorithm}
          disabled={isStarted}
        />

        <Switch
          checked={checked}
          onChange={updateChecked}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>

      <div className="w-full flex items-center justify-around ">
        <button
          onClick={() => setDimensionsStorage(generateData(200))}
          className={`px-2 py-1 font-medium text-white rounded shadow ${
            isStarted ? "bg-blue-300" : "bg-blue-500"
          }`}
          disabled={isStarted}
        >
          Generate data
        </button>
        <button
          onClick={() => {
            start(dimensionsStorage);
          }}
          disabled={isStarted}
          className={`px-2 py-1 font-medium text-white rounded shadow ${
            isStarted ? "bg-blue-300" : "bg-blue-500"
          }`}
        >
          Start
        </button>
        <button
          className="px-2 py-1 font-medium text-white rounded shadow bg-blue-500"
          onClick={reset}
        >
          Reset
        </button>
      </div>

      {!checked && (
        <button
          disabled={isFinished}
          onClick={placeNext}
          className="px-2 py-1 font-medium text-white bg-blue-500 rounded shadow"
        >
          {isFinished ? "you're done" : "Next!"}
        </button>
      )}

      {checked && (
        <div className="space-y-12">
          {algoState !== "STOPPED" && (
            <button
              onClick={pause}
              className={
                "px-2 py-1 font-medium text-white rounded shadow " +
                (algoState === "PAUSED" ? "bg-green-500" : "bg-amber-500")
              }
            >
              {isStarted ? "Pause" : "Resume"}
            </button>
          )}
          <RangeSlider
            progress={speed}
            onChange={updateSpeed}
            className="mt-6"
          />
        </div>
      )}
    </Card>
  );
};

export default Actions;
