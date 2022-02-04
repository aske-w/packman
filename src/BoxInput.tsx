import { FormEvent, useEffect, useRef, useState } from "react";
import Header from "./box-input-components/Header";
import { Rectangle } from "./box-input-components/Interfaces";
import RectInput from "./box-input-components/RectInput";
import React from "react";

interface BoxInputProps {}

const BoxInput: React.FC<BoxInputProps> = ({}) => {

    const [rectangles, setRectangles] = useState<Rectangle[]>([{width: 150, height: 200}, {width: 50, height: 25}]);
    const [width, setWidth] = useState<string>("");
    const [height, setHeight] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    const parseRectangleProperties = (width: string, height: string): {parsedWidth: number, parsedHeight: number} => {
        return {parsedWidth: Number.parseInt(width), parsedHeight: Number.parseInt(height)};
    };

    const saveRectangle = (width: number, height: number) => {
        let newRects = rectangles;
        newRects.push({width, height});
        setRectangles(newRects);
    };

    const removeRectangle = (index: number) => {
        let newRects = rectangles;
        newRects.splice(index, 1);
        setRectangles(newRects);
    };

    const isInt = (x: string): boolean => {
        return Number.isInteger(Number.parseInt(x));
    };

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        if(isInt(width) && isInt(height)) {
            const {parsedWidth, parsedHeight} = parseRectangleProperties(width, height);
            saveRectangle(parsedWidth, parsedHeight);
            setWidth("");
            setHeight("");
            inputRef.current?.focus()
        }
    }

    return <div className="bg-white grid grid-cols-2 gap-2 p-2">
        <Header title="Width"></Header>
        <Header title="Height"></Header>
        <div className="col-span-2 h-0 border-b-2 border-gray-400 w-full"></div>
        {rectangles.map((r, index) => (
            <div key={index} className="col-span-2 grid grid-cols-11 gap-2">
                <RectInput cssClasses="rounded-full text-center px-3 border-2 col-span-5" readonly={true} value={r.width}></RectInput>
                <RectInput cssClasses="rounded-full text-center px-3 border-2 col-span-5" readonly={true} value={r.height}></RectInput>

            </div>
        ))}
        <form action="" onSubmit={handleFormSubmit} className="col-span-2 grid grid-cols-2 gap-2">
            <RectInput value={width} onChangeHandler={e => setWidth(e.target.value)} reference={inputRef}></RectInput>
            <RectInput value={height} onChangeHandler={e => setHeight(e.target.value)}></RectInput>
            <button type="submit" className="hidden"></button>
        </form>
    </div>;
}

export default BoxInput;