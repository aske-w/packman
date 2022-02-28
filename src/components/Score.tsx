import React from "react";

interface ScoreProps {
  primary: string | number;
  secondary?: string | number;
}

const Score: React.FC<ScoreProps> = ({ primary, secondary }) => {
  return (
    <div className="rounded-lg relative flex items-center p-2">
      {secondary && (
        <small className="absolute top-1 text-gray-300 text-xs">
          {secondary}
        </small>
      )}

      <div className=" space-x-4 mt-2">
        <label className="text-sm">{primary}</label>
      </div>
    </div>
  );
};

export default Score;
