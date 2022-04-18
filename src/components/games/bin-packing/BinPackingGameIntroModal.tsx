import { Transition, Dialog } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { Fragment, useEffect, useState } from 'react';
import useHelpStore from '../../../store/help.store';
import { Gamemodes } from '../../../types/Gamemodes.enum';

interface BinPackingGameIntroModalProps {}

const BinPackingGameIntroModal: React.FC<BinPackingGameIntroModalProps> = ({}) => {
  const { introOpen, setIntroOpen, dontShowAgainOfflineBin, setDontShowAgainOfflineBin } = useHelpStore();
  useEffect(() => {
    // make sure it's opened on mount
    setIntroOpen(!dontShowAgainOfflineBin);
  }, []);
  return (
    <>
      <Transition appear show={introOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIntroOpen(false)}>
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
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden prose text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl max-h-[40rem] overflow-y-auto">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Welcome to Bin Packing
                </Dialog.Title>
                <div className="mt-2 ">
                  <h4>Objective</h4>
                  <p className="">
                    In this game mode your objective is to get the highest possible score by packing the least amount of bins and packing the bins as
                    densly as possible in the
                    <b>
                      <em> top right </em>
                    </b>
                    strip.
                  </p>
                  <p>Your are competing against an algorithm. It has the same objective as you.</p>
                  <h4>Inventory</h4>
                  <p className="">
                    The left part of your is your inventory. This is all the rectangles that you have yet to pack. To pack one of these simply drag it
                    to your strip.
                  </p>
                  <p>
                    Each rectangle will be given a number when the algorithm packs. The number indicates which rectangles the algorithm has choosen
                    and in which order.
                  </p>
                  <h4>Algorithm</h4>
                  <p className="">
                    In the bottom right corner of your screen you can see another strip. This is the strip where the algorithm packs its rectangles.
                    The algorithm has the same inventory as you do.
                  </p>
                  <p>
                    After you have placed a rectangle the algorithm will do the same. The numbers that appear in the inventory is the order of which
                    the algorithm has selected the rectangles.
                  </p>

                  <p className="italic">
                    You can always open this again by clicking
                    <QuestionMarkCircleIcon className="inline w-5 h-5 mx-2 text-gray-800" />
                    in the top right corner
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <form className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 h-5 w-5 focus:ring-0"
                      checked={dontShowAgainOfflineBin}
                      onChange={() => setDontShowAgainOfflineBin(true)}
                    />
                    <label className="tracking-wide">Don't show again</label>
                  </form>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIntroOpen(false)}
                  >
                    Got it, thanks!
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

export default BinPackingGameIntroModal;
