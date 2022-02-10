import React, { ChangeEventHandler, RefObject } from "react";

interface RectInputProps {
  value: string | number;
  className?: string;
  reference?: RefObject<HTMLInputElement>;
  readonly?: boolean;
  onChangeHandler?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  dimension?: "w" | "h";
}

const RectInput: React.FC<RectInputProps> = ({
  value,
  className = "bg-canvas text-white font-light text-base p-2 w-full rounded-lg",
  reference,
  readonly = false,
  onChangeHandler,
  disabled = false,
  dimension,
}) => {
  return (
    <div className="flex flex-row items-center bg-canvas p-2 w-full focus:outline-none border-none rounded-lg">
      <input
        className="bg-canvas focus:outline-none border-none text-white font-light text-sm w-10/12"
        type="text"
        value={value}
        onChange={onChangeHandler}
        readOnly={readonly}
        disabled={disabled}
        ref={reference}
      />
      {dimension && (
        <small className="w-2/12 text-xs uppercase text-gray-400">
          {dimension}
        </small>
      )}
    </div>
  );
};

export default RectInput;
