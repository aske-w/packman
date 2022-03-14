import { Transition, Dialog } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { Fragment, useMemo } from 'react';
import { PackingAlgorithms } from '../../../types/PackingAlgorithm.interface';
import FFDHArticle from './algorithm-articles/FFDHArticle';
import NFDHArticle from './algorithm-articles/NFDHArticle';

interface TeachAlgoModalProps {
  visible: boolean;
  onClose: () => void;
  algorithm: PackingAlgorithms;
}

const TeachAlgoModal: React.FC<TeachAlgoModalProps> = ({
  algorithm,
  onClose,
  visible,
}) => {
  const article = useMemo(() => {
    switch (algorithm) {
      case PackingAlgorithms.FIRST_FIT_DECREASING_HEIGHT:
        return <FFDHArticle />;
      case PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT:
        return <NFDHArticle />;
      default:
        return null;
    }
  }, [algorithm]);

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden prose text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl max-h-[40rem] overflow-y-auto">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {algorithm}
                </Dialog.Title>
                <div className="mt-2 ">{article}</div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onClose}>
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
