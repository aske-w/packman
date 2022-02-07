import React, { ChangeEventHandler, RefObject } from "react";

interface RectInputProps {
  value: string | number;
  cssClasses?: string;
  reference?: RefObject<HTMLInputElement>;
  readonly?: boolean;
  onChangeHandler?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const RectInput: React.FC<RectInputProps> = ({
  value,
  cssClasses,
  reference,
  readonly = false,
  onChangeHandler,
  disabled = false,
}) => {
  return (
    <input
      className={cssClasses ?? "rect-input"}
      type="text"
      value={value}
      onChange={onChangeHandler}
      readOnly={readonly}
      disabled={disabled}
      ref={reference}
    />
  );
};

export default RectInput;
