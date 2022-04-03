import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Badge from './components/Badge';
import Table, { Row } from './components/Table';
import { Gamemodes } from '../../types/enums/Gamemodes.enum';
import useAchievementStore from '../../store/achievement.store';
import DefaultNav from '../../components/Nav/DefaultNav';
import { NAV_HEIGHT } from '../../config/canvasConfig';
import Tabs from '../../components/Tabs/Tabs';
import { PieChart } from 'react-minimal-pie-chart';

interface AchievementProps {}

type MappedRow = Record<Gamemodes, Row[][]>;

const init = (): MappedRow => ({
  [Gamemodes.BIN_PACKING]: [],
  [Gamemodes.STRIP_PACKING]: [],
  [Gamemodes.ONLINE_STRIP_PACKING]: [],
});

const Achievement: React.FC<AchievementProps> = ({}) => {
  const headers = useMemo(() => ['Algorithm', 'Level', 'Highest score', 'Wins', 'Losses', 'Date'], []);
  const [rows, setRows] = useState<MappedRow>(init);
  const gameModes = [Gamemodes.STRIP_PACKING, Gamemodes.BIN_PACKING, Gamemodes.ONLINE_STRIP_PACKING];
  const { gameResults, badges } = useAchievementStore(useCallback(({ gameResults, badges }) => ({ gameResults, badges }), []));
  const totalWins = useMemo(() => gameResults.reduce((acc, v) => v.wins + acc, 0), [gameResults]);
  const totalLosses = useMemo(() => gameResults.reduce((acc, v) => v.loses + acc, 0), [gameResults]);

  console.log({ gameResults, badges });

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

      if (!result.gamemode) return acc;

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
            <Tabs tabs={gameModes}>
              {gameModes.map((mode, i) => {
                if (rows[mode]?.length === 0)
                  return (
                    <div key={mode} className="flex flex-col ">
                      <h2 className="font-medium">You have no results yet</h2>
                      <small className="text-gray-300">Start playing you punk</small>
                    </div>
                  );

                return (
                  <div className="w-full flex-shrink-0" key={mode}>
                    <Table className="w-full" headers={headers} rows={rows[mode]} />
                  </div>
                );
              })}
            </Tabs>

            <div className="inline-flex w-full overflow-x-hidden snap-mandatory touch-none"></div>
          </div>

          {/* Highlights */}
          <div className="w-4/12 flex items-center justify-center">
            <PieChart
              className="max-h-64"
              label={({ x, y, dx, dy, dataEntry }) => (
                <g x={x} y={y} dx={dx} dy={dy}>
                  <text x={x} y={y} dx={dx} dy={dy} dominantBaseline="central" textAnchor="middle" className="text-sm fill-slate-200">
                    {dataEntry.value}
                  </text>
                  <text
                    x={x}
                    y={y + 10}
                    dx={dx}
                    dy={dy}
                    dominantBaseline="central"
                    textAnchor="middle"
                    style={{ fontSize: 5 }}
                    className="fill-slate-300"
                  >
                    {dataEntry.title}
                  </text>
                </g>
              )}
              data={[
                { title: 'Wins', value: totalWins, color: '#059669' },
                { title: 'Losses', value: totalLosses, color: '#dc2626' },
              ]}
              lineWidth={15}
              rounded
            />
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
