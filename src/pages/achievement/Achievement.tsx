import React from 'react';
import Badge from './components/Badge';
import HighLight from './components/HighLight';
import Table from './components/Table';

interface AchievementProps {}

const Achievement: React.FC<AchievementProps> = ({}) => {
  return (
    <div className="w-full h-full p-4 space-y-4 text-white">
      <h2 className="font-bold text-xl">Your Results</h2>
      <div className="w-full flex space-x-10">
        {/* All results */}
        <Table className="w-8/12" />

        {/* Highlights */}

        <HighLight text="Total wins" className="bg-green-600" value={20} />

        {/* <div>Total wins</div>
        <div>Total plays</div> */}
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
