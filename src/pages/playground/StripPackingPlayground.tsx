import Konva from 'konva';
import { useState } from 'react';
import ReactJoyride from 'react-joyride';
import Canvas, { WithColor } from '../../components/Canvas';
import StripPackingPlaygroundIntroModal from '../../components/playground/strip/StripPackingPlaygroundIntroModal';
import StripPackingSidebar from '../../components/Sidebar/StripPackingSidebar';
import { usePackingAlgorithms } from '../../hooks/usePackingAlgorithms';
import { Dimensions } from '../../types/Dimensions.interface';
import { Rectangle } from '../../types/Rectangle.interface';
import { PackingAlgorithmEnum } from '../../types/enums/OfflineStripPackingAlgorithm.enum';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import PlaygroundNav from '../../components/Nav/PlaygroundNav';
import Joyride from '../../components/playground/Joyride';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';

function StripPackingPlayground() {
  const [stripWidth, setStripWidth] = useState(400);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PackingAlgorithmEnum>(PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT);
  const { start, pause, place, algoState, isFinished, reset: resetAlgo } = usePackingAlgorithms(stripWidth, selectedAlgorithm);

  const placeNext = () => {
    const rect = place();

    if (rect) {
      setRects(old => [...old, { ...rect, color: Konva.Util.getRandomColor() }]);
    }
  };

  const [dimensionsStorage, setDimensionsStorage] = useState<Dimensions[]>([]);
  const [rects, setRects] = useState<WithColor<Rectangle>[]>([]);

  const reset = () => {
    setRects([]);
    resetAlgo();
  };

  return (
    <div
      style={{
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        width: '100%',
      }}
    >
      <PlaygroundNav />

      <div className="flex w-full h-full ">
        <StripPackingPlaygroundIntroModal />
        <Joyride playground={Gamemodes.STRIP_PACKING}/>
        <StripPackingSidebar
          {...{
            selectedAlgorithm,
            setSelectedAlgorithm,
            isFinished,
            placeNext,
            start: (data) => {
              reset();
              start(data)
            },
            dimensionsStorage,
            setDimensionsStorage,
            algoState,
            reset,
            pause,
            setStripWidth,
            stripWidth,
          }}
        />

        <div className="flex items-center justify-center w-full h-full p-4">
          <Canvas rects={rects} width={stripWidth} />
        </div>
      </div>
    </div>
  );
}

export default StripPackingPlayground;
