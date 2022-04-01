import { Dialog, Transition } from '@headlessui/react';
import { ArrowLeftIcon, BadgeCheckIcon } from '@heroicons/react/outline';
import { CheckIcon, RefreshIcon, XIcon } from '@heroicons/react/solid';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';
import useAlgorithmStore from '../../store/algorithm.store';
import useEventStore from '../../store/event.store';
import useGameEndStore from '../../store/gameEnd.store';
import useLevelStore from '../../store/level.store';
import useScoreStore from '../../store/score.store';
import { Events } from '../../types/enums/Events.enum';
import { GameEndModalTitle } from '../../types/enums/GameEndModalTitle.enum';
import { getYearMonthDay } from '../../utils/utils';
import Button from './Button';
import GameEndModalItem from './Item';

interface GameEndModalProps {}

const GameEndModal: React.FC<GameEndModalProps> = ({}) => {
  const [title, setTitle] = useState<GameEndModalTitle | undefined>();
  const [titleTextColor, setTitleTextColor] = useState<string | undefined>();
  const { event, setEvent } = useEventStore(useCallback(({ event, setEvent }) => ({ event, setEvent }), []));
  const { blur, setBlur } = useGameEndStore();
  const { user: userScore, algo: algoScore } = useScoreStore(useCallback(state => ({ user: state.user.height, algo: state.algorithm.height }), []));
  const { level } = useLevelStore();
  const { algorithm } = useAlgorithmStore();
  const { getPersonalBest, lastPlayed, setLastPlayed } = useScoreStore();

  useEffect(() => {
    switch (event) {
      case Events.GAME_OVER:
        setTitle(GameEndModalTitle.GAME_OVER);
        setTitleTextColor('text-red-500');
        setBlur(true);
        return () => setLastPlayed();
      case Events.FINISHED:
        setTitle(GameEndModalTitle.FINISHED);
        setTitleTextColor('text-green-500');
        setBlur(true);
        return () => setLastPlayed();
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
          <Confetti recycle={false} run={title !== undefined && title == GameEndModalTitle.FINISHED} />
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
                <div className="absolute top-0 right-0 mt-2 mr-3 text-gray-200">
                  <ul className="text-sm leading-3 list-none">
                    {getYearMonthDay(new Date(Date.now())) !==
                    (lastPlayed ? getYearMonthDay(lastPlayed) : 0) /* TODO: get last game date from store */ ? (
                      <li className="flex flex-row justify-start px-2 pt-2 pb-1 transition-all rounded bg-zinc-500 bg hover:scale-105">
                        <CheckIcon className="h-4 pr-1 text-green-500" />
                        <span>First game of the day</span>
                      </li>
                    ) : undefined}
                    {userScore < algoScore ? (
                      <li className="flex flex-row justify-start px-2 pt-2 pb-1 transition-all rounded bg-zinc-500 bg hover:scale-105">
                        <CheckIcon className="h-4 pr-1 text-green-500" />
                        <span>Beat the algorithm</span>
                      </li>
                    ) : (
                      <li className="flex flex-row justify-start px-2 pt-2 pb-1 transition-all rounded bg-zinc-500 bg hover:scale-105">
                        <XIcon className="h-4 pr-1 text-red-500" />
                        <span>Beat by the algorithm</span>
                      </li>
                    )}
                    {userScore < (getPersonalBest(algorithm, level)?.height ?? userScore + 1) ? (
                      <li className="flex flex-row justify-start px-2 pt-2 pb-1 transition-all rounded bg-zinc-500 bg hover:scale-105">
                        <CheckIcon className="h-4 pr-1 text-green-500" />
                        <span>New personal best</span>
                      </li>
                    ) : undefined}
                  </ul>
                </div>
                <div className="w-3/4 m-auto text-white">
                  <GameEndModalItem name="Your score" value={userScore} />
                  <GameEndModalItem name="Personal best" value={getPersonalBest(algorithm, level)?.height ?? userScore} />
                  <GameEndModalItem name="Algorithm score" value={algoScore} />
                  <GameEndModalItem name="Level" value={level} />
                  <GameEndModalItem name="Algorithm" value={algorithm} />
                  <div className="flex justify-between pt-3">
                    <div className="flex justify-start">
                      <Link to="/" className="mr-3 no-underline modal-button" onClick={() => reset()}>
                        <ArrowLeftIcon className="h-5 pr-1" />
                        Back
                      </Link>
                      <Button onClick={() => reset(Events.RESTART)}>
                        <RefreshIcon className="h-5 pr-1" />
                        Restart
                      </Button>
                    </div>
                    <Link to="/achievements" className="no-underline modal-button" onClick={() => reset()}>
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
