import React from 'react';
import { Levels } from '../../../types/Levels.enum';
import { PackingAlgorithms } from '../../../types/PackingAlgorithm.interface';
import classNames from 'classnames';

interface TableProps {
  className?: string;
}

const Table: React.FC<TableProps> = ({ className }) => {
  return (
    <div className={classNames('flex flex-col overflow-scroll', className)}>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-lightMain">
                <tr>
                  <Header text="Algorithm" />
                  <Header text="Level" />
                  <Header text="Score" />
                  <Header text="Date" />
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-main border-gray-700">
                  <Row text={PackingAlgorithms.BEST_FIT_DECREASING_HEIGHT} />
                  <Row text={Levels.EXPERT} />
                  <Row text="100" />
                  <Row text={Date.now().toLocaleString()} />
                </tr>

                <tr className="border-b bg-main border-gray-700">
                  <Row text={PackingAlgorithms.FIRST_FIT_DECREASING_HEIGHT} />
                  <Row text={Levels.EXPERT} />
                  <Row text="100" />
                  <Row text={Date.now().toLocaleString()} />
                </tr>

                <tr className="bg-main">
                  <Row text={PackingAlgorithms.NEXT_FIT_DECREASING_HEIGHT} />
                  <Row text={Levels.EXPERT} />
                  <Row text="100" />
                  <Row text={Date.now().toLocaleString()} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ text: string }> = ({ text }) => {
  return (
    <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase text-gray-400">
      {text}
    </th>
  );
};

const Row: React.FC<{ text: string }> = ({ text }) => {
  return <td className="py-4 px-6 text-sm font-medium whitespace-nowrap text-white">{text}</td>;
};

export default Table;
