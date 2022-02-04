import { Listbox } from '@headlessui/react';
import { useRef, useState } from 'react';
import { start } from 'repl';
import { Dimensions } from './types/Dimensions.interface';
import AlgoSelect from './components/AlgoSelect';
import Canvas, { CanvasHandle } from './components/Canvas';
import { usePackingAlgorithms } from './hooks/usePackingAlgorithms';
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from './types/PackingAlgorithm.interface';

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
      <div></div>

      <div className="flex items-center justify-center h-screen bg-red-400">
        <Canvas ref={canvasHandle} size={size} />
      </div>
      <div className="flex flex-col items-center justify-start">
        <AlgoSelect
          options={ALL_PACKING_ALGORITHMS}
          onChange={setSelectedAlgorithm}
          value={selectedAlgorithm}
        />
        <button
          onClick={() => {
            canvasHandle.current?.reset();
            start(genData(100));
          }}
          className="px-2 py-1 font-medium text-white bg-blue-500 rounded shadow ">
          Start!
        </button>
        <button
          disabled={isFinished}
          onClick={placeNext}
          className="px-2 py-1 font-medium text-white bg-blue-500 rounded shadow">
          {isFinished ? "you're done" : 'Next!'}
        </button>
      </div>
    </div>
  );
}

export default App;

export const genData = (amount = 10): Dimensions[] => {
  return Array.from({ length: amount }, (_, _i) => {
    return {
      width: Math.round(Math.random() * 200),
      height: Math.round(Math.random() * 100),
    };
  });
};
