import React, { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { PersistGate } from 'zustand-persist';
import { BadgeContainer } from './components/Badges';
import useGameEndStore from './store/gameEnd.store';
import useHelpStore from './store/help.store';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
  const { blur: showModal } = useGameEndStore();
  const { setIntroOpen, dontShowAgain } = useHelpStore();

  /**
   * Set intial value if helper modals should open based on previous persisted values
   */
  useEffect(() => {
    setIntroOpen(!dontShowAgain);
  }, [dontShowAgain]);

  return useMemo(
    () => (
      <PersistGate>
        <BadgeContainer />
        <div className={`${showModal ? 'blur' : ''} flex flex-col w-screen h-screen bg-canvas`}>
          <Outlet />
        </div>
      </PersistGate>
    ),
    [showModal]
  );
};

export default App;
