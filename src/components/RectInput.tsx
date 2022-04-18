import classNames from 'classnames';
import React, { ChangeEventHandler, RefObject } from 'react';

interface RectInputProps {
  value: string | number;
  className?: string;
  reference?: RefObject<HTMLInputElement>;
  readonly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  sec?: string;
}

const RectInput: React.FC<RectInputProps> = ({ value, className, reference, readonly = false, onChange: onChangeHandler, disabled = false, sec }) => {
  return (
    <div
      className={classNames(
        disabled ? ' opacity-40 ' : '',
        ' flex flex-row items-center bg-canvas w-full focus:outline-none border-0 rounded-lg overflow-hidden',
        className
      )}
    >
      <input
        className="w-10/12 p-2 text-sm font-light text-white border-0 focus:border-0 !focus:shadow-none bg-canvas !focus:outline-none appearance-arrow-none !ring-0"
        type={typeof value}
        value={value}
        onChange={onChangeHandler}
        readOnly={readonly}
        disabled={disabled}
        ref={reference}
      />
      {sec && <small className="w-2/12 text-xs text-gray-400 uppercase">{sec}</small>}
    </div>
  );
};

export default RectInput;
