import React from 'react';
import {
  ALL_PACKING_ALGORITHMS,
  PackingAlgorithms,
} from '../../types/PackingAlgorithm.interface';
import AlgoSelect from '../AlgoSelect';
import Sidebar from './Sidebar';
import SideBarSection from './SideBarSection';

interface BinPackingSidebarProps {
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  algorithm: string;
}

const SIDEBAR_WIDTH = 480;

const BinPackingSidebar: React.FC<BinPackingSidebarProps> = ({
  setAlgorithm,
  algorithm,
}) => {
  return (
    <Sidebar style={{ width: SIDEBAR_WIDTH }}>
      <SideBarSection title="Algorithms">
        <AlgoSelect<string>
          className="w-72 text-white text-base font-thin"
          options={[]}
          onChange={setAlgorithm}
          value={algorithm}
          disabled={false}
        />
      </SideBarSection>
    </Sidebar>
  );
};

export default BinPackingSidebar;
