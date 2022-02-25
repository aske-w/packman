import React, { useRef, useState } from "react";
import StripPackingAlgorithm, {
  StripPackingAlgorithmCanvasHandle,
} from "../../components/games/stripPacking/StripPackingAlgorithm";
import StripPackingInteractive from "../../components/games/stripPacking/StripPackingInteractive";
import { genInventory } from "../../config/canvasConfig";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const [input, setInput] = useState(genInventory);
  const ref = useRef<StripPackingAlgorithmCanvasHandle>(null);
  //   state gen data

  const onStripDrop = () => {
    ref?.current?.place();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <StripPackingInteractive
          input={input}
          onDragDrop={onStripDrop}
        ></StripPackingInteractive>
        <StripPackingAlgorithm
          ref={ref}
          input={input}
          algorithm={PackingAlgorithms.SIZE_ALTERNATING_STACK}
        ></StripPackingAlgorithm>
      </div>
    </div>
  );
};

export default StripPackingGame;
