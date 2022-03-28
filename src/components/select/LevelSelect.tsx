import React, { useCallback, useMemo } from 'react';
import useLevelStore from '../../store/level.store';
import { LevelList, Levels } from '../../types/Levels.enum';
import Select from './Select';

interface LevelSelectProps {}

const LevelSelect: React.FC<LevelSelectProps> = ({}) => {
  const { level, setLevel } = useLevelStore(
    useCallback(
      ({ level, setLevel }) => ({
        level,
        setLevel,
      }),
      []
    )
  );

  return useMemo(() => {
    const getColor = () => {
      switch (level) {
        case Levels.BEGINNER:
          return 'bg-green-500';
        case Levels.NOVICE:
          return 'bg-blue-500';
        case Levels.EXPERT:
          return 'bg-red-500';
      }
    };

    return (
      <Select
        className="w-32"
        innerClassname={getColor() + ' text-white'}
        selectIconClass={'w-5 h-5'}
        value={level}
        options={LevelList}
        onChange={setLevel}
      />
    );
  }, [level, setLevel]);
};

export default LevelSelect;
