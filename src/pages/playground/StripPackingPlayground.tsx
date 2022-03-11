import Konva from "konva";
import { useEffect, useState } from "react";
import { promptBadge } from "../../components/Badges";
import Canvas, { WithColor } from "../../components/Canvas";
import StripPackingSidebar from "../../components/Sidebar/StripPackingSidebar";
import { usePackingAlgorithms } from "../../hooks/usePackingAlgorithms";
import { Badges } from "../../types/Badges.enum";
import { Dimensions } from "../../types/Dimensions.interface";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";
import { Rectangle } from "../../types/Rectangle.interface";

function StripPackingPlayground() {
  const [stripWidth, setStripWidth] = useState(400);
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
  } = usePackingAlgorithms(stripWidth, selectedAlgorithm);

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

  useEffect(() => {
    // TODO remove
    promptBadge(Badges.AT_LEAST_YOU_TRIED);
    promptBadge(Badges.STREAK);
    promptBadge(Badges.SUCCESS_ON_FIRST_ATTEMPT);
    promptBadge(Badges.COMPLETED_AN_ALGORITHM);
    promptBadge(Badges.ACHIEVED_FULL_POINTS);
    promptBadge(Badges.IMITATED_ALL_ALGORITHMS);
    promptBadge(Badges.COMPETED_AGAINST_ALL_ALGORITHMS);
    promptBadge(Badges.COMPLETED_TUTORIAL);
  }, []);

  return (
    <div className="flex w-full h-full ">
      <StripPackingSidebar
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
          setStripWidth: setStripWidth,
          stripWidth: stripWidth,
        }}
      />
      <div className="flex items-center justify-center w-full h-full p-4">
        <Canvas rects={rects} width={stripWidth} />
      </div>
    </div>
  );
}

export default StripPackingPlayground;
