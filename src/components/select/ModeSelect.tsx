import React from 'react';
import Select from './Select';

interface ModeSelectProps {
  onChange: (val: Modes) => void;
  value: Modes;
}

export type Modes = 'Worst input' | 'Best input';

const ModeSelect: React.FC<ModeSelectProps> = ({ onChange, value }) => {
  const options: Modes[] = ['Worst input', 'Best input'];

  return <Select className="w-36" value={value} onChange={onChange} options={options} />;
};

export default ModeSelect;
