import React from 'react';
import { AlgoStates } from '../../hooks/usePackingAlgorithms';
import Button from '../Button';
import SideBarItem from './SidebarItem';

interface ActionBtnSelectorProps {
  pause(): void;
  start(): void;
  placeNext(): void;
  isAutoPlace: boolean;
  disabled: boolean;
  algoState: AlgoStates;
}

const ActionBtnSelector: React.FC<ActionBtnSelectorProps> = ({
  algoState,
  isAutoPlace,
  pause,
  placeNext,
  start,
  disabled,
}) => {
  switch (algoState) {
    case 'RUNNING': {
      const text = isAutoPlace ? 'Pause' : 'Next';
      return (
        <SideBarItem
          element={
            <Button
              text={text}
              onClick={isAutoPlace ? pause : placeNext}
              className={isAutoPlace ? 'bg-amber-600' : undefined}
            />
          }
          text={text}
        />
      );
    }
    case 'STOPPED':
      return (
        <SideBarItem
          className="strip-playground-start"
          element={
            <Button
              disabled={disabled}
              text="Start"
              onClick={start}
              className="bg-green-600"
            />
          }
          text="Start"
        />
      );
    case 'PAUSED':
      return (
        <SideBarItem
          element={
            <Button text="Resume" onClick={start} className={'bg-green-600'} />
          }
          text="Resume"
        />
      );

    default:
      return <></>;
  }
};

export default ActionBtnSelector;
