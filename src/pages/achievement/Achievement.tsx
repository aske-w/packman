import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Badge from './components/Badge';
import HighLight from './components/HighLight';
import Table, { Row } from './components/Table';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';
import { useCarousal } from '../../hooks/useCarousal';
import useAchievementStore from '../../store/achievement.store';
import DefaultNav from '../../components/Nav/DefaultNav';
import { NAV_HEIGHT } from '../../config/canvasConfig';

interface AchievementProps {}

type MappedRow = Record<Gamemodes, Row[][]>;

const init = (): MappedRow => ({
  [Gamemodes.BIN_PACKING]: [],
  [Gamemodes.STRIP_PACKING]: [],
});

const Achievement: React.FC<AchievementProps> = ({}) => {
  const headers = useMemo(() => ['Algorithm', 'Level', 'Highest score', 'Wins', 'Losses', 'Date'], []);
  const [rows, setRows] = useState<MappedRow>(init);
  const gameModes = [Gamemodes.STRIP_PACKING, Gamemodes.BIN_PACKING];
  const { refs, previousItem, nextItem, activeItem } = useCarousal(gameModes);
  const { gameResults, badges } = useAchievementStore(useCallback(({ gameResults, badges }) => ({ gameResults, badges }), []));
  const totalWins = useMemo(() => gameResults.reduce((acc, v) => v.wins + acc, 0), [gameResults]);
  const totalLosses = useMemo(() => gameResults.reduce((acc, v) => v.loses + acc, 0), [gameResults]);

  console.log({ gameResults });
  console.log({ badges });

  useEffect(() => {
    const rows = gameResults.reduce<MappedRow>((acc, result) => {
      const rows: Row[] = [
        { text: result.algorithm },
        { text: result.level },
        { text: result.score.toFixed(2) },
        { text: result.wins.toFixed(0) },
        { text: result.loses.toFixed(0) },
        { text: new Date(result.date).toLocaleDateString() },
      ];

      acc[result.gamemode].push(rows);

      return acc;
    }, init());

    setRows(rows);
  }, [gameResults]);

  return (
    <div style={{ height: `100% - ${NAV_HEIGHT}px` }} className="w-full text-white">
      <DefaultNav height={NAV_HEIGHT} />
      <div className="w-full h-full p-4 space-y-4 ">
        <h2 className="font-bold text-xl">Your Results</h2>
        <div className="w-full flex space-x-10 m-0">
          {/* All results */}
          <div className="relative w-8/12">
            <div className="absolute flex flex-row items-center right-0 -top-8">
              <ChevronLeftIcon className="w-6 hover:scale-125 duration-150 ease-out cursor-pointer" onClick={previousItem} />
              <label>{activeItem}</label>
              <ChevronRightIcon className="w-6 hover:scale-125 duration-150 ease-out cursor-pointer" onClick={nextItem} />
            </div>
            <div className="inline-flex w-full overflow-x-hidden snap-mandatory touch-none">
              {rows[activeItem].length === 0 ? (
                <div className="flex flex-col ">
                  <h2 className="font-medium">You have no results yet</h2>
                  <small className="text-gray-300">Start playing you punk</small>
                </div>
              ) : (
                <>
                  {gameModes.map((mode, i) => {
                    return (
                      <div className="w-full flex-shrink-0" key={mode} ref={refs[i]}>
                        <Table className="w-full" headers={headers} rows={rows[mode]} />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Highlights */}

          <div className="w-4/12 grid grid-cols-2">
            <HighLight text="Total wins" className="bg-green-600" value={totalWins} />
            <HighLight text="Total losses" className="bg-red-600" value={totalLosses} />
          </div>
        </div>
        {/* Badge section */}
        <div className="flex justify-start flex-col font-medium">
          <h2 className="font-bold text-xl">Your badges</h2>
          <small className="text-gray-100">
            {badges.length} badge{badges.length === 1 ? '' : 's'}
          </small>
        </div>
        <div className="flex justify-start flex-row flex-wrap text-white">
          {badges.map(badge => (
            <Badge key={badge.title} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievement;
