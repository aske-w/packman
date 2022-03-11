import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import BinPackingGame from './pages/games/BinPackingGame';
import StripPackingGame from './pages/games/StripPackingGame';
import Home from './pages/Home';
import BinPackingPlayground from './pages/playground/BinPackingPlayground';
import StripPackingPlayground from './pages/playground/StripPackingPlayground';
import { pathKey } from './pages/routes';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path={pathKey.PLAYGROUND} element={<Outlet />}>
            <Route path={pathKey.STRIP} element={<StripPackingPlayground />} />
            <Route path={pathKey.BIN} element={<BinPackingPlayground />} />
          </Route>
          <Route path={pathKey.GAME} element={<Outlet />}>
            <Route path={pathKey.STRIP} element={<StripPackingGame />} />
            <Route path={pathKey.BIN} element={<BinPackingGame />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
