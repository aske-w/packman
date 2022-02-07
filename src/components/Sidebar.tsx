import React from "react";
import { AlgoStates } from "../hooks/usePackingAlgorithms";
import { Dimensions } from "../types/Dimensions.interface";
import { PackingAlgorithms } from "../types/PackingAlgorithm.interface";
import Actions from "./Actions";

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

const Sidebar: React.FC<SidebarProps> = ({ width, children, ...props }) => {
  return (
    <div
      className="flex flex-row h-full"
      style={{
        width: `calc(100% - ${width}px)`,
      }}
    >
      <div style={{ width }} className="h-full bg-slate-800">
        <Actions {...props} />
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
