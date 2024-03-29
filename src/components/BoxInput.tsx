import { FormEvent, useCallback, useRef, useState } from 'react';
import RectInput from './RectInput';
import React from 'react';
import { DuplicateIcon, TrashIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Dimensions } from '../types/Dimensions.interface';

interface BoxInputProps {
  disabled?: boolean;
  allowDuplication?: boolean;
  iconSizeClass?: string;
  dimensionsStorage: Dimensions[];
  setDimensionsStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>;
}

const BoxInput: React.FC<BoxInputProps> = ({
  dimensionsStorage,
  setDimensionsStorage,
  disabled = false,
  allowDuplication = false,
  iconSizeClass = 'w-14',
}) => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const parseRectangleProperties = (width: string, height: string): { parsedWidth: number; parsedHeight: number } => {
    return {
      parsedWidth: Number.parseInt(width),
      parsedHeight: Number.parseInt(height),
    };
  };

  const saveRectangle = (width: number, height: number) => {
    if (!disabled) setDimensionsStorage([{ width, height }].concat(dimensionsStorage));
  };

  const removeRectangle = (index: number) => {
    if (!disabled) {
      setDimensionsStorage(r => {
        const temp = [...r];
        temp.splice(index, 1);
        return temp;
      });
    }
  };

  const isInt = (x: string): boolean => {
    return Number.isInteger(Number.parseInt(x));
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isInt(width) && isInt(height)) {
      const { parsedWidth, parsedHeight } = parseRectangleProperties(width, height);
      saveRectangle(parsedWidth, parsedHeight);
      setWidth('');
      setHeight('');
      inputRef.current?.focus();
    }
  };

  const duplicate = useCallback(
    (rect: Dimensions, index: number) => {
      // insert duplicate dimensions where the user clicked on duplication button
      let newDimensions = [];
      for (let i = 0; i < dimensionsStorage.length; i++) {
        newDimensions.push(dimensionsStorage[i]);
        if (index == i) newDimensions.push(rect);
      }
      setDimensionsStorage(newDimensions);
    },
    [dimensionsStorage]
  );

  return (
    // <div className="flex flex-col items-center justify-start w-full space-y-4 overflow-y-scroll rounded custom-scrollbar">
    <div className="flex-1 min-h-0">
      <div className="h-full p-4 overflow-y-scroll flex-grow-1 custom-scrollbar">
        <div className="flex flex-col items-center justify-start w-full space-y-4 rounded ">
          <form action="" onSubmit={handleFormSubmit} className="flex flex-row items-center w-full space-x-6">
            <RectInput value={width} onChange={e => setWidth(e.target.value)} reference={inputRef} disabled={disabled} sec="w"></RectInput>
            <RectInput value={height} onChange={e => setHeight(e.target.value)} disabled={disabled} sec="h"></RectInput>

            <button
              className="text-white hover:text-green-200 disabled:text-gray-700"
              type="submit"
              disabled={disabled || width.length === 0 || height.length === 0}
            >
              <CheckCircleIcon className="w-6 h-6 " />
            </button>
          </form>
          {dimensionsStorage.map((r, index) => (
            <div key={index} className="flex flex-row items-center w-full space-x-6">
              <RectInput readonly={true} value={r.width} sec="w"></RectInput>
              <RectInput readonly={true} value={r.height} sec="h"></RectInput>
              {allowDuplication ? (
                <DuplicateIcon
                  className={`${iconSizeClass} ${disabled ? 'text-gray-500' : 'hover:cursor-pointer hover:scale-110 text-gray-200'}`}
                  onClick={() => duplicate(r, index)}
                />
              ) : undefined}
              <TrashIcon
                className={`${iconSizeClass} ${disabled ? 'text-gray-500' : 'hover:cursor-pointer hover:text-red-400 hover:scale-110 text-gray-200'}`}
                onClick={e => removeRectangle(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxInput;
