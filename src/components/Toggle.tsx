import React from 'react';

interface Props {
  checked: boolean;
  onClick(val: boolean): void;
  label?: string;
}

const Toggle: React.FC<Props> = ({ checked, label, onClick }) => {
  const handleClick = React.useCallback(() => {
    onClick(!checked);
  }, [checked, onClick]);

  return (
    <div className="flex justify-center">
      <div className="form-check form-switch">
        <input
          className="float-left h-5 -ml-10 align-top bg-white bg-gray-300 bg-no-repeat bg-contain rounded-full shadow-sm appearance-none cursor-pointer form-check-input w-9 focus:outline-none"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          checked={checked}
          onClick={handleClick}
        />
        {label && (
          <label
            className="inline-block text-gray-800 form-check-label"
            htmlFor="flexSwitchCheckChecked">
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

export default Toggle;
