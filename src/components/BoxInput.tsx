import { FormEvent, useRef, useState } from "react";
import RectInput from "./RectInput";
import React from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { Dimensions } from "../types/Dimensions.interface";
import Card from "./Card";

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
    <Card className="w-full grow">
      {/* <div className="flex flex-row justify-around py-2">
        <Header title="Width" />
        <Header title="Height" />
      </div> */}
      {/* <div className="col-span-11 h-0 border-b-2 border-stone-400 w-full"></div> */}
      <div className="w-full flex flex-col justify-center items-center space-y-4">
        <form
          action=""
          onSubmit={handleFormSubmit}
          className="w-full flex flex-row items-center space-x-6"
        >
          <RectInput
            value={width}
            onChangeHandler={(e) => setWidth(e.target.value)}
            reference={inputRef}
            disabled={disabled}
            sec="w"
          ></RectInput>
          <RectInput
            value={height}
            onChangeHandler={(e) => setHeight(e.target.value)}
            disabled={disabled}
            sec="h"
          ></RectInput>
          {/* <TrashIcon className="w-14 text-gray-200" /> */}
          <button type="submit" className="hidden" disabled={disabled}></button>
        </form>

        {rectangles.map((r, index) => (
          <div
            key={index}
            className="w-full flex flex-row items-center space-x-6"
          >
            <RectInput readonly={true} value={r.width} sec="w"></RectInput>
            <RectInput readonly={true} value={r.height} sec="h"></RectInput>
            <TrashIcon
              className={`w-14 ${
                disabled
                  ? "text-gray-500"
                  : "hover:cursor-pointer hover:text-red-400 hover:scale-110 text-gray-200"
              }`}
              onClick={(e) => removeRectangle(index)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BoxInput;
