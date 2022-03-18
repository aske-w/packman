import React from 'react';

interface GameEndModalItemProps {
  name: string;
  value: string | number;
}

const GameEndModalItem: React.FC<GameEndModalItemProps> = ({ name, value }) => {
  return (
    <div className="grid grid-cols-2">
      <div className="pr-2 opacity-60">{name}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

export default GameEndModalItem;
