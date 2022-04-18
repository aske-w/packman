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
        <ReactJoyride
          steps={[
            {
              content: "Here you can select which algorithm that you're visualizing.",
              target: '.strip-playground-algo-select',
            },
            {
              content: "This toggle allows you to enable 'auto place', which makes the algorithm continuously packing rectangles.",
              target: '.strip-playground-auto-place',
            },
            {
              content: 'This buttons resets the algorithm and removes all test data that has been entered.',
              target: '.strip-playground-reset',
            },
            {
              content: 'Use this button to start the visualization. After it has been clicked you use it to progress the visualization.',
              target: '.strip-playground-start',
            },
            {
              content: 'Here you can choose how wide the strip should be',
              target: '.strip-playground-dimensions',
            },
            {
              content: 'Here you can auto generate test data',
              target: '.strip-playground-auto-gen',
            },
            {
              content: 'This button populates the test data, with what was previously used. This is useful for comparing to algorithms.',
              target: '.strip-playground-prev-data',
            },
            {
              content: 'In this section you can add, remove or modify the test data. Just press enter to add it to the data set',
              target: '.strip-playground-test-data',
            },
          ]}
          continuous
        />
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
