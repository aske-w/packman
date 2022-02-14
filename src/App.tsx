import { useState } from "react";
import { Dimensions } from "./types/Dimensions.interface";
import Canvas, { WithColor } from "./components/Canvas";
import { usePackingAlgorithms } from "./hooks/usePackingAlgorithms";
import { PackingAlgorithms } from "./types/PackingAlgorithm.interface";
import { Rectangle } from "./types/Rectangle.interface";
import Konva from "konva";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import { TestData } from "./algorithms/SizeAlternatingStack.fixture";
import { toast, ToastContainer } from "react-toastify";

const NAV_HEIGHT = 64;
const SIDEBAR_WIDTH = 480;

function App() {
  const [size, setSize] = useState<Dimensions>({
    height: 700,
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
  
  ]);
  const [rects, setRects] = useState<WithColor<Rectangle>[]>([]);

  const reset = () => {
    setRects([]);
    setDimensionsStorage([]);
    resetAlgo();
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-canvas">
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
          <div className="flex items-center justify-center w-full h-full p-4">
            <Canvas rects={rects} size={size} />
          </div>
        </Sidebar>
      </Nav>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
