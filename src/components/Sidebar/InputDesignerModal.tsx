import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon, SaveAsIcon, TrashIcon } from "@heroicons/react/outline";
// import { Layer as LayerReference, LayerConfig } from "konva/lib/Layer";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { KonvaNodeComponent, Layer, Rect, Stage } from "react-konva";
import { toast, ToastOptions } from "react-toastify";
import { ColorRect } from "../../types/ColorRect.interface";
import { Dimensions } from "../../types/Dimensions.interface";
import { RectangleConfig } from "../../types/RectangleConfig.interface";
import { clamp } from "../../utils/clamp";
import { generateData } from "../../utils/generateData";
import BoxInput from "../BoxInput"
import RangeSlider from "../RangeSlider";
import RectInput from "../RectInput";

interface InputDesignerModalProps {
  existingRects: Dimensions[]
  setExistingRects: (newInput: Dimensions[]) => void;
  visible: boolean;
  onClose: () => void;
  maxWidth?: number;
  maxHeight?: number;
}

const InputDesignerModal: React.FC<InputDesignerModalProps> = ({ existingRects, setExistingRects, visible, onClose, maxWidth, maxHeight }) => {
  const [newDimensions, setNewDimensions] = useState<Dimensions[]>([])
  useEffect(() => {
    if(visible)
      setNewDimensions(existingRects)
    else 
      setNewDimensions([])
  }, [existingRects, visible])
  const onSaveAndClose = () => {
    setExistingRects(newDimensions);
    onClose();
  }
  const onDiscard = () => {
    onClose();
  }
 
  const [dragStarted, setDragStarted] = useState(false);
  const [startPosition, setStartPosition] = useState<Vector2d>();
  const [rect, setRect] = useState<ColorRect<RectangleConfig>>() 
  const [scale, setScale] = useState(50);
  const [genNum, setGenNum] = useState("1");

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const pointerPos = e.target.getStage()!.getPointerPosition()!;
    
    //check if mouse is inside existing rect
    if(rect != undefined) {
      const x2 = rect.x + rect.width
      const y2 = rect.y + rect.height
      if(rect.x < pointerPos.x && pointerPos.x < x2 && rect.y < pointerPos.y && pointerPos.y < y2)
        return;
    }

    setDragStarted(true);
    setStartPosition(pointerPos);
    setRect({x: pointerPos.x, y: pointerPos.y, width: 0, height: 0, name: "userRect", fill: "#555"})
  }
  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    setDragStarted(false);
    clearPositions();
  }
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if(!dragStarted) 
      return;

    const pointerPos = e.target.getStage()!.getPointerPosition()!;
    // setCurrPosition(pointerPos);

    let width = -(startPosition!.x - pointerPos.x)
    let height = -(startPosition!.y - pointerPos.y)
    const scaledWidth = getScaledValue(width);
    const scaledHeight = getScaledValue(height);

    if(maxWidth)
      width = clamp(scaledWidth, -maxWidth, maxWidth);
    if(maxHeight)
      height = clamp(scaledHeight, -maxHeight, maxHeight);

    setRect({...rect!, width, height})
  }
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    return;
  }
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const {x, y} = e.target._lastPos;
    setRect({...rect!, x, y})
  }
  const clearPositions = () => {
    setStartPosition(undefined);
  }
  const clearUserRect = () => {
    clearPositions();
    setRect(undefined);
  }
  const saveUserRect = () => {
    if(rect == undefined) {
      toast("No rectangle drawn", {type: "error"})
      return;
    }
    const scaledWidth = Math.abs(getScaledValue(rect!.width));
    const scaledHeight = Math.abs(getScaledValue(rect!.height));
    if(scaledWidth < 1 || scaledHeight < 1) {
      toast("Width or height below 1 is not allowed", {type: "error"})
      return;
    }
    setNewDimensions(prevState => {
      // put new dimensions at the top
      return insertInFront({width: scaledWidth, height: scaledHeight}, prevState);
    });
    clearUserRect();
  }

  const insertInFront = (item: Dimensions, rest: Dimensions[]) => [item].concat(rest);
  
  const [stage, setStage] = useState<HTMLDivElement>();
  const [stageWidth, setStageWidth] = useState(0);
  const interactiveRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setStage(node);
    }
  }, []);
  useEffect(() => {
    if(stage != null)
      setStageWidth(stage.clientWidth);
  }, [stage?.clientWidth]);

  const getScaledValue = useCallback((dimension: number) => {
    return Math.round(dimension * (scale * 2) / 100)
  }, [scale])

  const onRemoveAll = () => setNewDimensions([]);
  const onDuplicateAll = () => setNewDimensions(newDimensions.concat(newDimensions))
  const onCreateRandom = () => {
    const parsedNumber = Number.parseInt(genNum);
    if(parsedNumber !== parsedNumber) { // true if genNum couldn't be parsed
      toast("Input was not a number", {type: "error"})
      return;
    }

    let max = maxWidth;
    // set smallest limit to max
    if(maxHeight)
      if(max)
        max = maxHeight < max ? maxHeight : max;

    setNewDimensions(generateData(parsedNumber, max, 5).concat(newDimensions))
  }

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden prose text-left align-middle transition-all transform bg-zinc-600 shadow-xl rounded-2xl h-[40rem] overflow-y-hidden">
                <div className="flex justify-between h-[38rem]">
                  <div className="w-2/5 h-full overflow-y-scroll">
                    <div className="ml-4">
                      <button
                        type="button"
                        className="inline-flex justify-center mr-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={onDuplicateAll}
                      >
                        Duplicate all
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={onRemoveAll}
                      >
                        Remove all
                      </button>
                      <div className="flex justify-right mt-2">
                        <button
                          onClick={onCreateRandom}
                          className={`inline-flex justify-center mr-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${!visible ? 'opacity-60' : 'hover:bg-blue-200'}`}
                          disabled={!visible}
                        >
                          Generate N
                        </button>
                        <RectInput
                          disabled={!visible}
                          value={genNum}
                          onChange={e => setGenNum(e.target.value)}
                          className="w-4/12 px-3 select-none"
                          sec="N"
                        />
                      </div>
                    </div>
                    <BoxInput dimensionsStorage={newDimensions} setDimensionsStorage={setNewDimensions} allowDuplication={true} iconSizeClass="w-20" />
                  </div>
                  <div className="w-3/5 text-white" ref={interactiveRef}>
                    <h3 className="mt-4 text-center text-white">Interactive</h3>
                    <div className="grid grid-cols-12 mb-3">
                      <div className="col-span-6">
                        Rect: {rect ? "Width: " + Math.abs(getScaledValue(rect!.width)) + ", height: " + Math.abs(getScaledValue(rect!.height)) : "None yet"}
                      </div>
                      <div className="col-span-3">
                        Scale: {scale * 2}%
                        <RangeSlider progress={scale} onChange={setScale} hideTooltip />
                      </div>
                      <div className="col-span-3 flex justify-end">
                        <TrashIcon className="w-10 mr-3 hover:scale-110 hover:text-red-400 hover:cursor-pointer" onClick={clearUserRect}/>
                        <CheckCircleIcon className="w-10 hover:scale-110 hover:text-green-400 hover:cursor-pointer" onClick={saveUserRect}/>
                      </div>
                    </div>
                    <Stage height={300} width={stageWidth} className="bg-gray-200 max-w-full" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={e => onMouseMove(e)}>
                      <Layer fill={"#333"}>
                        <Rect 
                          {...rect} 
                          draggable
                          onDragEnd={handleDragEnd}
                          onDragMove={handleDragMove}
                        >

                        </Rect>
                      </Layer>
                    </Stage>
                  </div>
                </div>
                <div className="flex justify-end mt-4 absolute bottom-4 right-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onDiscard}
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onSaveAndClose}
                  >
                    Save &amp; close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InputDesignerModal;
