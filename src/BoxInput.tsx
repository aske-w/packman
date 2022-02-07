import { FormEvent, useRef, useState } from "react";
import Header from "./components/Header";
import RectInput from "./components/RectInput";
import React from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { Dimensions } from "./types/Dimensions.interface";

interface BoxInputProps {
  disabled?: boolean;
  dimensionsStorage: Dimensions[];
  setDimensionsStorage: React.Dispatch<React.SetStateAction<Dimensions[]>>;
}

const BoxInput: React.FC<BoxInputProps> = ({
  dimensionsStorage,
  setDimensionsStorage,
  disabled = false,
}) => {
  const rectangles = dimensionsStorage;
  const setRectangles = setDimensionsStorage;
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const parseRectangleProperties = (
    width: string,
    height: string
  ): { parsedWidth: number; parsedHeight: number } => {
    return {
      parsedWidth: Number.parseInt(width),
      parsedHeight: Number.parseInt(height),
    };
  };

  const saveRectangle = (width: number, height: number) => {
    if (!disabled) {
      let newRects = rectangles;
      newRects.push({ width, height });
      setRectangles(newRects);
    }
  };

  const removeRectangle = (index: number) => {
    if (!disabled) {
      setRectangles((r) => {
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
      const { parsedWidth, parsedHeight } = parseRectangleProperties(
        width,
        height
      );
      saveRectangle(parsedWidth, parsedHeight);
      setWidth("");
      setHeight("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white grid grid-cols-11 gap-2 p-2 max-h-screen">
      <Header title="Width"></Header>
      <Header title="Height"></Header>
      <div className="col-span-11 h-0 border-b-2 border-gray-400 w-full"></div>
      <div className="col-span-11 grid grid-cols-11 gap-2 max-h-full overflow-y-scroll pt-2">
        {rectangles.map((r, index) => (
          <div key={index} className="col-span-11 grid grid-cols-11 gap-2 px-2">
            <RectInput readonly={true} value={r.width}></RectInput>
            <RectInput readonly={true} value={r.height}></RectInput>
            <TrashIcon
              className={`col-span-1 ${
                disabled
                  ? "text-gray-200"
                  : "hover:cursor-pointer hover:text-red-600 hover:scale-110"
              }`}
              onClick={(e) => removeRectangle(index)}
            />
          </div>
        ))}
        <form
          action=""
          onSubmit={handleFormSubmit}
          className="col-span-11 grid grid-cols-11 gap-2 px-2 pb-2"
        >
          <RectInput
            value={width}
            onChangeHandler={(e) => setWidth(e.target.value)}
            reference={inputRef}
            disabled={disabled}
          ></RectInput>
          <RectInput
            value={height}
            onChangeHandler={(e) => setHeight(e.target.value)}
            disabled={disabled}
          ></RectInput>
          <TrashIcon className="text-gray-200" />
          <button type="submit" className="hidden" disabled={disabled}></button>
        </form>
      </div>
    </div>
  );
};

export default BoxInput;
