import { useState } from "react";
import { Dimensions } from "./types/Dimensions.interface";
import Canvas, { WithColor } from "./components/Canvas";
import { usePackingAlgorithms } from "./hooks/usePackingAlgorithms";
import { PackingAlgorithms } from "./types/PackingAlgorithm.interface";
import { Rectangle } from "./types/Rectangle.interface";
import Konva from "konva";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar/Sidebar";

const NAV_HEIGHT = 64;
const SIDEBAR_WIDTH = 480;

function App() {
  const [size, setSize] = useState<Dimensions>({
    height: 600,
    width: 500,
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PackingAlgorithms>(
    PackingAlgorithms.SIZE_ALTERNATING_STACK
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

  const [dimensionsStorage, setDimensionsStorage] = useState<Dimensions[]>([
    { width: 100, height: 400 }, // 1
    { width: 10, height: 350 }, // 6
    { width: 60, height: 300 }, // 10
    { width: 15, height: 200 }, //9
    { width: 20, height: 100 }, // 4

    { width: 300, height: 250 }, // 2
    { width: 250, height: 50 }, // 3
    { width: 150, height: 100 }, // 5
    { width: 100, height: 30 }, // 7
    { width: 80, height: 20 }, // 8
  ]);
  const [rects, setRects] = useState<WithColor<Rectangle>[]>([]);

  const reset = () => {
    setRects([]);
    setDimensionsStorage([
      { width: 100, height: 400 }, // 1
      { width: 10, height: 350 }, // 6
      { width: 60, height: 300 }, // 10
      { width: 15, height: 200 }, //9
      { width: 20, height: 100 }, // 4

      { width: 300, height: 250 }, // 2
      { width: 250, height: 50 }, // 3
      { width: 150, height: 100 }, // 5
      { width: 100, height: 30 }, // 7
      { width: 80, height: 20 }, // 8
    ]);
    resetAlgo();
  };

  return (
    <div className=" bg-canvas h-screen w-screen flex flex-col">
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
          <div className="p-4 h-full w-full flex items-center justify-center">
            <Canvas rects={rects} size={size} />
          </div>
        </Sidebar>
      </Nav>
    </div>
  );
}

export default App;
