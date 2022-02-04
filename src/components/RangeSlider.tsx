import React from "react";
import Slider from "react-slider";

interface Props {
  progress: number;
  onChange: (progress: number) => void;
  className?: string;
}

const RangeSlider: React.FC<Props> = ({ progress, onChange, className }) => {
  const trackClass = "rounded-full";

  return (
    <div
      className={
        className +
        " bg-gray-300 w-full h-2 relative flex items-center " +
        trackClass
      }
    >
      <Slider
        value={progress}
        className={"text-white w-full flex items-center h-full " + trackClass}
        onChange={(val) => {
          onChange(val);
        }}
        renderThumb={(props, state) => (
          <div
            {...props}
            className={" focus:outline-none flex items-center justify-center"}
          >
            <div className="bg-white p-2 border border-gray-200 rounded-full cursor-pointer"></div>
            <span className="bg-black px-3 py-2 text-xs absolute rounded-md -top-8">
              {state.valueNow}
            </span>
          </div>
        )}
      />
      <div
        className={"absolute h-full bg-teal-600 " + trackClass}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default RangeSlider;
