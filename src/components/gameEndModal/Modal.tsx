import { Dialog, Transition } from '@headlessui/react';
import { ArrowLeftIcon, BadgeCheckIcon } from '@heroicons/react/outline';
import { RefreshIcon } from '@heroicons/react/solid';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';
import { createSemanticDiagnosticsBuilderProgram } from 'typescript';
import useEventStore from '../../store/event.store';
import useGameEndStore from '../../store/gameEnd.store';
import { Events } from '../../types/Events.enum';
import { GameEndModalTitles } from '../../types/GameEndModalTitles.enum';
import { Levels } from '../../types/Levels.enum';
import { PackingAlgorithms } from '../../types/PackingAlgorithm.interface';
import Button from './Button';
import GameEndModalItem from './Item';

interface GameEndModalProps {}

const GameEndModal: React.FC<GameEndModalProps> = ({}) => {
  const [title, setTitle] = useState<GameEndModalTitles | undefined>();
  const [titleTextColor, setTitleTextColor] = useState<string | undefined>();
  const { event, setEvent } = useEventStore(useCallback(({ event, setEvent }) => ({ event, setEvent }), []));
  const { blur, setBlur } = useGameEndStore();

  useEffect(() => {
    switch (event) {
      case Events.GAME_OVER:
        setTitle(GameEndModalTitles.GAME_OVER);
        setTitleTextColor('text-red-500');
        setBlur(true);
        break;
      case Events.FINISHED:
        setTitle(GameEndModalTitles.FINISHED);
        setTitleTextColor('text-green-500');
        setBlur(true);
        break;
    }
  }, [event]);

  const reset = (event = Events.IDLE) => {
    setBlur(false);
    setTitle(undefined);
    setEvent(event);
  };

  return (
    <div>
      <Transition appear show={title !== undefined} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => {}}>
          <Confetti recycle={false} run={title !== undefined && title == GameEndModalTitles.FINISHED}/>
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
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden prose text-left align-middle transition-all bg-zinc-600 bg-opacity-80 transform shadow-xl rounded-2xl max-h-[40rem] overflow-y-auto">
                <Dialog.Title as="h3" className={`text-5xl font-extrabold text-center rounded h-12 leading-none ${titleTextColor!}`}>
                  {title}
                </Dialog.Title>
                {/**
                 * Your score:
                 * Personal best:
                 * Level:
                 * Algorithm:
                 * [Restart] [Back]
                 * [Your achievements]
                 */}
                <div className="w-3/4 m-auto text-white">
                  <GameEndModalItem name="Your score" value={1234} />
                  <GameEndModalItem name="Personal best" value={4321} />
                  <GameEndModalItem name="Level" value={Levels.EXPERT} />
                  <GameEndModalItem name="Algorithm" value={PackingAlgorithms.BEST_FIT_DECREASING_HEIGHT} />
                  <div className="flex justify-between pt-3">
                    <div className="flex justify-start">
                      <Button additionalClasses="mr-3" onClick={() => reset(Events.RESTART)}>
                        <RefreshIcon className="h-5 pr-1" />
                        Restart
                      </Button>
                      <Link to="/" className="modal-button no-underline" onClick={() => reset()}>
                        <ArrowLeftIcon className="h-5 pr-1" />
                        Back
                      </Link>
                    </div>
                    <Link to="/achievements" className="modal-button no-underline" onClick={() => reset()}>
                      <BadgeCheckIcon className="h-5 pr-1" />
                      Your achievements
                    </Link>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default GameEndModal;
