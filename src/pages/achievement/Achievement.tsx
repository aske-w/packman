import React, { useRef } from 'react';
import Badge from './components/Badge';
import HighLight from './components/HighLight';
import Table from './components/Table';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid';
import { Gamemodes } from '../../types/Gamemodes.enum';
import { useCarousal } from '../../hooks/useCarousal';

interface AchievementProps {}

const Achievement: React.FC<AchievementProps> = ({}) => {
  const gameModes = [Gamemodes.STRIP_PACKING, Gamemodes.BIN_PACKING];
  const { refs, previousItem, nextItem, activeItem } = useCarousal(gameModes);
  const ref = useRef(null);

  return (
    <div className="w-full h-full p-4 space-y-4 text-white">
      <h2 className="font-bold text-xl">Your Results</h2>
      <div className="w-full flex space-x-10">
        {/* All results */}
        <div className="relative w-8/12">
          <div className="absolute flex flex-row items-center right-0 -top-8">
            <ChevronLeftIcon className="w-6 hover:scale-125 duration-150 ease-out cursor-pointer" onClick={previousItem} />
            <label>{activeItem}</label>
            <ChevronRightIcon className="w-6 hover:scale-125 duration-150 ease-out cursor-pointer" onClick={nextItem} />
          </div>
          <div className="inline-flex w-full overflow-x-hidden snap-mandatory touch-none">
            {/* <Table className="w-full" /> */}
            {gameModes.map((mode, i) => {
              return (
                <div className="w-full flex-shrink-0" key={mode} ref={refs[i]}>
                  <Table className="w-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights */}

        <div className="w-4/12 grid grid-cols-2">
          <HighLight text="Total wins" className="bg-green-600" value={20} />
          <HighLight text="Total losses" className="bg-red-600" value={1000} />
        </div>
      </div>
      {/* Badge section */}
      <div className="flex justify-start flex-col font-medium">
        <h2 className="font-bold text-xl">Your badges</h2>
        <small className="text-gray-100">1 Badge</small>
      </div>
      <div className="flex justify-start flex-col text-white">
        <Badge />
      </div>
    </div>
  );
};

export default Achievement;
