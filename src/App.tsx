import { useState } from "react";
import { Dimensions } from "./types/Dimensions.interface";
import Canvas, { WithColor } from "./components/Canvas";
import { usePackingAlgorithms } from "./hooks/usePackingAlgorithms";
import { PackingAlgorithms } from "./types/PackingAlgorithm.interface";
import Actions from "./components/Actions";
import BoxInput from "./BoxInput";
import { Rectangle } from "./types/Rectangle.interface";
import Konva from "konva";

function App() {
  const [size, setSize] = useState<Dimensions>({
    height: 800,
    width: 400,
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PackingAlgorithms>(
    PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT
  );

  const { start, place, algoState, isFinished } = usePackingAlgorithms(
    size,
    selectedAlgorithm
  );

  const placeNext = () => {
    const rect = place();
    if (rect) {
      setRects((old) => [
        ...old,
        { ...rect, color: Konva.Util.getRandomColor() },
      ]);
    }
  };

  const [dimensionsStorage, setDimensionsStorage] = useState<Dimensions[]>([]);
  const [rects, setRects] = useState<WithColor<Rectangle>[]>([]);

  const reset = () => {
    setRects([]);
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex flex-col items-center justify-start">
        <BoxInput
          dimensionsStorage={dimensionsStorage}
          setDimensionsStorage={setDimensionsStorage}
        ></BoxInput>
      </div>

      <div className="flex items-center justify-center h-screen bg-red-400">
        <Canvas rects={rects} size={size} />
      </div>

      <div className="flex flex-col items-center justify-start">
        <Actions
          {...{
            selectedAlgorithm,
            setSelectedAlgorithm,
            isFinished,
            placeNext,
            start,
            dimensionsStorage,
            setDimensionsStorage,
            algoState,
            reset,
          }}
        />
      </div>
    </div>
  );
}

export default App;
