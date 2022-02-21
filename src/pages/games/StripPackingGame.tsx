import React, { useCallback, useState } from "react";
import StripAlgoCanvas from "../../components/games/stripPacking/StripAlgoCanvas";
import StripPacking from "../../components/games/stripPacking/StripPacking";
import { genInventory } from "../../config/canvasConfig";
import { ColorRect } from "../../types/ColorRect.interface";
import { PackingAlgorithms } from "../../types/PackingAlgorithm.interface";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  const [input, setInput] = useState(genInventory);
  //   state gen data

  const onStripDrop = useCallback((rect: ColorRect) => {}, []);

  const genData = () => {};

  return (
    <div className="w-full flex justify-between items-center">
      <StripPacking input={input}></StripPacking>
      <StripAlgoCanvas
        input={input}
        algorithm={PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT}
      ></StripAlgoCanvas>
    </div>
  );
};

export default StripPackingGame;
