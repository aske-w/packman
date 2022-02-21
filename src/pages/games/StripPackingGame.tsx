import React, { useCallback, useRef, useState } from "react";
import StripAlgoCanvas, {
  StripAlgoCanvasHandle,
} from "../../components/games/stripPacking/StripAlgoCanvas";
import StripPacking from "../../components/games/stripPacking/StripPacking";
import { genInventory } from "../../config/canvasConfig";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const [input, setInput] = useState(genInventory);
  const ref = useRef<StripAlgoCanvasHandle>(null);
  //   state gen data

  const onStripDrop = () => {
    ref?.current?.place();
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <StripPacking input={input} onDragDrop={onStripDrop}></StripPacking>
        <StripAlgoCanvas
          ref={ref}
          input={input}
          algorithm={PackingAlgorithms.FIRST_FIT_DECREASING_HEIGHT}
        ></StripAlgoCanvas>
      </div>
    </div>
  );
};

export default StripPackingGame;
