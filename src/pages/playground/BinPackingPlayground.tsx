import React from 'react';
import BinPackingSidebar from '../../components/Sidebar/BinPackingSidebar';

interface BinPackingPlaygroundProps {}

const BinPackingPlayground: React.FC<BinPackingPlaygroundProps> = ({}) => {
  return (
    <div className="h-full w-full">
      <BinPackingSidebar />
    </div>
  );
};

export default BinPackingPlayground;
