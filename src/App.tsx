import React from 'react';
import { Outlet } from 'react-router-dom';
import { PersistGate } from 'zustand-persist';
import { BadgeContainer } from './components/Badges';
import useGameEndStore from './store/gameEnd.store';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
  const { blur: showModal } = useGameEndStore();

  return (
    <PersistGate>
      <BadgeContainer />
      <div className={`${showModal ? 'blur' : ''} flex flex-col w-screen h-screen bg-canvas`}>
        <Outlet />
      </div>
    </PersistGate>
  );
};

export default App;
