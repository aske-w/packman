import React, { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Bin from '../../components/playground/Bin';
import BinPackingSidebar from '../../components/Sidebar/BinPackingSidebar';
import { generateData, generateInventory } from '../../utils/generateData';

interface BinPackingPlaygroundProps {}
const width = window.innerWidth * 0.7;
const height = window.innerHeight * 0.5;
const BinPackingPlayground: React.FC<BinPackingPlaygroundProps> = ({}) => {
  const [algorithm, setAlgorithm] = useState('');

  return (
    <div className="h-full w-full flex ">
      {/* <BinPackingSidebar algorithm={algorithm} setAlgorithm={setAlgorithm} /> */}
      <div className="flex items-center justify-center p-10">
        <div className="grid gap-10 grid-cols-3 ">
          <Bin height={height} width={250} items={generateInventory(250, 10)} />
          <Bin height={height} width={250} items={generateInventory(250, 10)} />
          <Bin height={height} width={250} items={generateInventory(250, 10)} />
        </div>
      </div>
    </div>
  );
};

export default BinPackingPlayground;
