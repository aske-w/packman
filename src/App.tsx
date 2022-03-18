import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import { NAV_HEIGHT } from './config/canvasConfig';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="flex flex-col w-screen h-screen bg-canvas">
      <Nav height={NAV_HEIGHT}>
        <Outlet />
      </Nav>
    </div>
  );
};

export default App;
