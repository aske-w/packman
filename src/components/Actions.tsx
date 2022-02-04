import React from "react";
import { useRangeSlider } from "../hooks/useRangeSlider";
import { useToggle } from "../hooks/useToggle";
import RangeSlider from "./RangeSlider";
import Switch from "react-switch";
import { Dimensions } from "../types/Dimensions.interface";
import { CanvasHandle } from "./Canvas";
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from "../types/PackingAlgorithm.interface";
import AlgoSelect from "./AlgoSelect";

interface Props {
  isFinished: boolean;
  placeNext(): void;
  start(data: Dimensions[]): void;
  canvasHandle: React.RefObject<CanvasHandle>;
  selectedAlgorithm: PackingAlgorithms;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<PackingAlgorithms>>;
}

const Actions: React.FC<Props> = ({
  isFinished,
  placeNext,
  start,
  canvasHandle,
  setSelectedAlgorithm,
  selectedAlgorithm,
}) => {
  const { checked, updateChecked } = useToggle();
  const { progress, updateProgress } = useRangeSlider();

  if (checked) {
  }

  return (
    <div className="p-3 flex flex-col bg-zinc-200 rounded-md space-y-4">
      <div className="flex flex-row space-x-4 items-center justify-center">
        <AlgoSelect
          options={ALL_PACKING_ALGORITHMS}
          onChange={setSelectedAlgorithm}
          value={selectedAlgorithm}
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
          onClick={() => {
            canvasHandle.current?.reset();
            start(genData(100));
          }}
          className="px-2 py-1 font-medium text-white bg-blue-500 rounded shadow "
        >
          Start!
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
        <div>
          <RangeSlider
            progress={progress}
            onChange={updateProgress}
            className="mt-6"
          />
        </div>
      )}
    </div>
  );
};

export const genData = (amount = 10): Dimensions[] => {
  return Array.from({ length: amount }, (_, _i) => {
    return {
      width: Math.round(Math.random() * 200),
      height: Math.round(Math.random() * 100),
    };
  });
};

export default Actions;
