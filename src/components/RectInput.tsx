import React, { ChangeEventHandler, RefObject } from "react";

interface RectInputProps {
  value: string | number;
  className?: string;
  reference?: RefObject<HTMLInputElement>;
  readonly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  sec?: string;
}

const RectInput: React.FC<RectInputProps> = ({
  value,
  className,
  reference,
  readonly = false,
  onChange: onChangeHandler,
  disabled = false,
  sec,
}) => {
  return (
    <div
      className={
        className +
        " flex flex-row items-center bg-canvas p-2 w-full focus:outline-none border-none rounded-lg"
      }
    >
      <input
        className="bg-canvas focus:outline-none border-none text-white font-light text-sm w-10/12 appearance-arrow-none"
        type={typeof value}
        value={value}
        onChange={onChangeHandler}
        readOnly={readonly}
        disabled={disabled}
        ref={reference}
      />
      {sec && (
        <small className="w-2/12 text-xs uppercase text-gray-400">{sec}</small>
      )}
    </div>
  );
};

export default RectInput;
