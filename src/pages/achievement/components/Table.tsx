import React from 'react';
import { Levels } from '../../../types/Levels.enum';
import { PackingAlgorithms } from '../../../types/PackingAlgorithm.interface';
import classNames from 'classnames';

export interface Row {
  text: string;
}

interface TableProps {
  className?: string;
  headers: string[];
  rows: Row[][];
}

const Table: React.FC<TableProps> = ({ className, headers, rows }) => {
  return (
    <div className={classNames('flex flex-col', className)}>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-lightMain">
                <tr>
                  {headers.map(header => {
                    return <Header key={header} text={header} />;
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((_rows, i) => {
                  const border = i !== rows.length - 1 ? 'border-b border-gray-700' : '';
                  return (
                    <tr className={'bg-main ' + border}>
                      {_rows.map((row, j) => {
                        return <Row key={row.text} text={row.text} />;
                      })}
                    </tr>
                  );
                })}
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