import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { Algorithm } from '../../../types/enums/AllAlgorithms.enum';
import { BinPackingAlgorithm } from '../../../types/enums/BinPackingAlgorithm.enum';
import { PackingAlgorithmEnum } from '../../../types/enums/OfflineStripPackingAlgorithm.enum';
import FiniteNextFitArticle from '../bin/algorithm-articles/FiniteNextFitArticle';
import BFDHArticle from './algorithm-articles/BFDHArticle';
import FFDHArticle from './algorithm-articles/FFDHArticle';
import NFDHArticle from './algorithm-articles/NFDHArticle';
import SASArticle from './algorithm-articles/SASArticle';
import SleatorsArticle from './algorithm-articles/SleatorsArticle';
import SleatorsOptimizedArticle from './algorithm-articles/SleatorsOptimizedArticle';

interface TeachAlgoModalProps {
  visible: boolean;
  onClose: () => void;
  algorithm: Algorithm;
}

const TeachAlgoModal: React.FC<TeachAlgoModalProps> = ({ algorithm, onClose, visible }) => {
  const article = useMemo(() => {
    switch (algorithm) {
      case PackingAlgorithmEnum.FIRST_FIT_DECREASING_HEIGHT:
        return <FFDHArticle />;
      case PackingAlgorithmEnum.NEXT_FIT_DECREASING_HEIGHT:
        return <NFDHArticle />;
      case PackingAlgorithmEnum.BEST_FIT_DECREASING_HEIGHT:
        return <BFDHArticle />;
      case PackingAlgorithmEnum.SLEATORS:
        return <SleatorsArticle />;
      case PackingAlgorithmEnum.SLEATORS_OPTIMIZED:
        return <SleatorsOptimizedArticle />;
      case PackingAlgorithmEnum.SIZE_ALTERNATING_STACK:
        return <SASArticle />;
      case BinPackingAlgorithm.FINITE_NEXT_FIT:
        return <FiniteNextFitArticle />;
      default:
        return null;
    }
  }, [algorithm]);

  const [top, setTop] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (visible && top) {
      top?.scrollIntoView({
        block: 'start',
      });
    }
  }, [visible, top]);

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
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden prose text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl max-h-[40rem] overflow-y-auto">
                <div ref={setTop} />
                <Dialog.Title className="mt-2 text-lg font-medium text-gray-900">{algorithm}</Dialog.Title>
                <div className="mt-2 ">{article}</div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onClose}
                  >
                    Okay, that makes sense!
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

export default TeachAlgoModal;
