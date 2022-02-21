import React from "react";
import StripAlgoCanvas from "../../components/games/stripPacking/StripAlgoCanvas";
import StripPacking from "../../components/games/stripPacking/StripPacking";

interface StripPackingGameProps {}

const StripPackingGame: React.FC<StripPackingGameProps> = ({}) => {
  return (
    <div className="w-full flex justify-between items-center">
      <StripPacking></StripPacking>
      {/* <StripAlgoCanvas></StripAlgoCanvas> */}
    </div>
  );
};

export default StripPackingGame;
