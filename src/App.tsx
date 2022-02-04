import { Listbox } from "@headlessui/react";
import { useRef, useState } from "react";
import { start } from "repl";
import { Dimensions } from "./types/Dimensions.interface";
import AlgoSelect from "./components/AlgoSelect";
import Canvas, { CanvasHandle } from "./components/Canvas";
import { usePackingAlgorithms } from "./hooks/usePackingAlgorithms";
import { PackingAlgorithms } from "./types/PackingAlgorithm.interface";
import Actions from "./components/Actions";

function App() {
  const [size, setSize] = useState<Dimensions>({
    height: 800,
    width: 400,
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PackingAlgorithms>(
    PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT
  );

  const { start, place, getStats, isFinished, reset } = usePackingAlgorithms(
    size,
    selectedAlgorithm
  );

  const canvasHandle = useRef<CanvasHandle>(null);
  const placeNext = () => {
    const rect = place();
    if (rect) {
      return canvasHandle.current?.place(rect);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex items-center justify-center h-screen bg-red-400">
        <Canvas ref={canvasHandle} size={size} />
      </div>

      <div className="flex flex-col items-center justify-start">
        <Actions
          {...{
            selectedAlgorithm,
            setSelectedAlgorithm,
            isFinished,
            placeNext,
            start,
            canvasHandle,
          }}
        />
      </div>
    </div>
  );
}

export default App;
