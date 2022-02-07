import { useState } from "react";
import { Dimensions } from "./types/Dimensions.interface";
import Canvas, { WithColor } from "./components/Canvas";
import { usePackingAlgorithms } from "./hooks/usePackingAlgorithms";
import { PackingAlgorithms } from "./types/PackingAlgorithm.interface";
import Actions from "./components/Actions";
import BoxInput from "./BoxInput";
import { Rectangle } from "./types/Rectangle.interface";
import Konva from "konva";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";

const NAV_HEIGHT = 64;
const SIDEBAR_WIDTH = 400;

function App() {
  const [size, setSize] = useState<Dimensions>({
    height: 800,
    width: 400,
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PackingAlgorithms>(
    PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT
  );
  const {
    start,
    pause,
    place,
    algoState,
    isFinished,
    reset: resetAlgo,
  } = usePackingAlgorithms(size, selectedAlgorithm);

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
    setDimensionsStorage([]);
    resetAlgo();
  };

  return (
    <div className=" bg-slate-500 h-screen w-screen flex flex-col">
      <Nav height={NAV_HEIGHT}>
        <Sidebar
          width={SIDEBAR_WIDTH}
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
            pause,
          }}
        >
          <div className="grid grid-cols-3 gap-5 p-4 h-full w-full">
            <BoxInput
              dimensionsStorage={dimensionsStorage}
              setDimensionsStorage={setDimensionsStorage}
              disabled={algoState === "RUNNING"}
            ></BoxInput>

            <div className="flex items-center justify-center h-full">
              <Canvas rects={rects} size={size} />
            </div>

            <div className="flex flex-col items-center justify-start">
              {/* <Actions
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
                  pause,
                }}
              /> */}
            </div>
          </div>
        </Sidebar>
      </Nav>
    </div>
  );
}

export default App;
