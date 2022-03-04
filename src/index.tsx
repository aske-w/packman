import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Playground from "./pages/Playground";
import Home from "./pages/Home";
import OldStripPackingInteractive from "./components/games/stripPacking/OldStripPackingInteractive";
import StripPackingGame from "./pages/games/StripPackingGame";
import { pathKey } from "./pages/routes";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path={pathKey.PLAYGROUND} element={<Playground />} />
          <Route path={pathKey.GAME} element={<Outlet />}>
            <Route path={pathKey.STRIP} element={<StripPackingGame />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
