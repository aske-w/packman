import { Dialog, Transition } from "@headlessui/react";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import useInputDesignerStore from "../../store/inputDesigner.store";
import { ColorRect } from "../../types/ColorRect.interface";
import { Dimensions } from "../../types/Dimensions.interface";
import { RectangleConfig } from "../../types/RectangleConfig.interface";
import BoxInput from "../BoxInput"

interface InputDesignerModalProps {
  existingRects: Dimensions[]
  setExistingRects: (newInput: Dimensions[]) => void;
  visible: boolean;
  onClose: () => void;
}

const InputDesignerModal: React.FC<InputDesignerModalProps> = ({ existingRects, setExistingRects, visible, onClose }) => {
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

  
  let startPosition: Vector2d | undefined;

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // const {x, y} = e.target.getAttrs();
    // console.log();
    // console.log({x, y});
    startPosition = e.currentTarget.getStage()!.getPointerPosition()!;
  }
  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    // const {x, y} = e.target.getAttrs();
    // console.log({x, y});
    console.log({startPosition});
    const endPosition = e.target.getStage()!.getPointerPosition()!;
    rect.x = endPosition.x;
    rect.y = endPosition.y;
    setRect({...rect, x: endPosition.x, y: endPosition.y});
    startPosition == undefined
  }
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if(startPosition == undefined)
      return;

    
  }

  const [rect, setRect] = useState<ColorRect<RectangleConfig>>({width: 100, height: 100, name: "test", fill: "#555", x: 50, y: 50}) 
  
  const [stage, setStage] = useState<HTMLDivElement>();
  const [stageWidth, setStageWidth] = useState(0);
  // const stageRef = useRef<Stage>();
  const interactiveRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setStage(node);
    }
  }, []);
  useEffect(() => {
    if(stage != null)
      setStageWidth(stage.clientWidth);
  }, [stage?.clientWidth]);

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
                    <BoxInput dimensionsStorage={newDimensions} setDimensionsStorage={setNewDimensions} allowDuplication={true} iconSizeClass="w-20" />
                  </div>
                  <div className="w-3/5 text-white" ref={interactiveRef}>
                    <h3 className="mt-4 text-center text-white">Interactive</h3>
                    <div className="flex justify-evenly">
                      <span>
                        Rect WxH: 0x0
                      </span>
                      <span>
                        Scale: 100%
                      </span>
                    </div>
                    <Stage height={300} width={stageWidth} className="bg-gray-200 max-w-full" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
                      <Layer fill={"#333"}>
                        <Rect {...rect} draggable>

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
