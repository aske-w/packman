import Konva from 'konva';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import chunk from 'lodash/chunk';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { Link } from 'react-router-dom';
import { NextFitDecreasingHeight } from '../algorithms/strip/NextFitDecreasingHeight';
import { ColorRect } from '../types/ColorRect.interface';
import { pathName } from './routes';
interface HomeProps {}

const DELAY = 200;
const logoRects = [
  { x: 0, y: 28.4337, width: 11.2, height: 11.5663, fill: '#34D399' },
  { x: 1, y: 29.4337, width: 9.2, height: 9.56627, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 11.2, y: 28.4337, width: 20, height: 11.5663, fill: '#FBBF24' },
  { x: 12.2, y: 29.4337, width: 18, height: 9.56627, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { y: 14.2169, width: 9.6, height: 14.2169, fill: '#FB7185' },
  { x: 1, y: 15.2169, width: 7.6, height: 12.2169, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 9.59998, y: 14.2169, width: 18, height: 14.2169, fill: '#60A5FA' },
  { x: 10.6, y: 15.2169, width: 16, height: 12.2169, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 27.6, y: 14.2169, width: 9.4, height: 14.2169, fill: '#C084FC' },
  { x: 28.6, y: 15.2169, width: 7.4, height: 12.2169, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 30.4, y: 0, width: 9.6, height: 14.2169, fill: '#FB923C' },
  { x: 31.4, y: 1, width: 7.6, height: 12.2169, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 31.2, y: 28.4337, width: 8.8, height: 11.5663, fill: '#C084FC' },
  { x: 32.2, y: 29.4337, width: 6.8, height: 9.56627, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
  { x: 37, y: 14.2169, width: 3, height: 14.2169, fill: '#22D3EE' },
  { x: 37.75, y: 14.9669, width: 1.5, height: 12.7169, stroke: 'black', opacity: 0.49, strokeWidth: 1.5 },
  { x: 0, y: 0, width: 30.4, height: 14.2169, fill: '#F472B6' },
  { x: 1, y: 1, width: 28.4, height: 12.2169, stroke: 'black', opacity: 0.49, strokeWidth: 2 },
];
const FallingRect = ({
  y,
  i,
  screenHeight = 100,
  delay = DELAY,
  ...attrs
}: typeof logoRects[number] & { i: number; screenHeight?: number; delay?: number }) => {
  const ref = useRef<KonvaRect>(null);
  useEffect(() => {
    const tid = setTimeout(() => {
      new Konva.Tween({
        node: ref.current!,
        duration: 0.4,
        y,
        easing: Konva.Easings.StrongEaseInOut,
      }).play();
    }, i * delay);
    return () => clearTimeout(tid);
  }, [y, i]);
  return <Rect ref={ref} listening={false} {...attrs} y={y - screenHeight} />;
};

const AnimatedLogo = () => {
  return (
    <Stage width={80} height={80} scale={{ x: 2, y: 2 }} className="w-20 h-20">
      <Layer>
        {chunk(logoRects, 2).map(([r, s], i) => (
          <React.Fragment key={i}>
            <FallingRect i={i} {...r} />
            <FallingRect i={i} {...s} />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

const AnimatedBG = () => {
  const { innerHeight: h, innerWidth: w } = window;
  const rectangles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const height = Math.random() * h * 0.3;
      const width = Math.random() * w * 0.3;
      return {
        fill: Konva.Util.getRandomColor(),
        height,
        width,
        opacity: 0.3,
        name: nanoid(),
      };
    });
  }, [h, w]);
  const [placed, setPlaced] = useState<ColorRect[]>([]);

  const algo = useRef(new NextFitDecreasingHeight({ height: h, width: w }));
  useEffect(() => {
    algo.current.load([...rectangles]);
    let timer: null | NodeJS.Timer;
    timer = setInterval(() => {
      if (algo.current.isFinished()) {
        if (timer) {
          clearInterval(timer);
          return;
        }
      }
      const rect = algo.current.place();

      setPlaced(old => [...old, { ...rect, y: rect.y + h }]);
    }, 2000);
  }, [rectangles]);
  return (
    <Stage className="absolute inset-0 -z-10 blur-sm" width={window.innerWidth - 20} height={window.innerHeight}>
      <Layer>
        {placed.map((r, i) => (
          <FallingRect {...r} i={i} key={r.name} delay={0} screenHeight={window.innerHeight} />
        ))}
      </Layer>
    </Stage>
  );
};

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div className="relative flex flex-col items-center w-full h-full min-h-screen p-10 bg-gradient-to-b from-gray-700 to-gray-800 backdrop-blur backdrop-filter">
      <AnimatedBG />
      <div className="flex justify-center">
        <div className="flex flex-col items-start justify-center ">
          <div className="flex items-center justify-start space-x-4">
            <AnimatedLogo />
            <h1 className="text-6xl font-extrabold tracking-wide text-white">
              Packman <span className="text-sm font-normal tracking-normal">by Learnpacking.com</span>
            </h1>
          </div>
          <p className="max-w-xl mt-5 text-lg font-medium text-white ">
            Welcome to Packman! Here you can challenge yourself within the world of two-dimensional packing. Learn about the different algorithms in
            the playgrounds and take your newfound knowledge with you and beat the algorithms.
          </p>
        </div>
      </div>
      <div className="w-full max-w-screen-xl">
        <div className="flex flex-col-reverse items-center justify-around mt-12 md:items-start md:flex-row">
          <div className="flex flex-col mt-6 space-y-12 md:mt-0">
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl font-bold text-white">Playground</h2>
              <p className="!mt-0 text-sm font-light text-gray-100">Visualization and learning</p>
              <Link to={pathName.STRIP_PLAYGROUND}>
                <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-800 ">Strip Packing</h3>
                  <p className="text-sm text-gray-800">Learn and visualize different offline strip packing algorithms.</p>
                </div>
              </Link>
              <Link to={pathName.BIN_PLAYGROUND}>
                <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-800 ">Bin Packing</h3>
                  <p className="text-sm text-gray-800">Learn and visualize different bin packing algorithms.</p>
                </div>
              </Link>
            </div>
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl font-bold text-white">Extra</h2>
              <p className="!mt-0 text-sm font-light text-gray-100">All the other stuff</p>
              <Link to={pathName.ACHIEVEMENTS}>
                <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-800 ">Achievements and stats</h3>
                  <p className="text-sm text-gray-800">Check out your progress.</p>
                </div>
              </Link>
              <Link to={pathName.ABOUT}>
                <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-800 ">About</h3>
                  <p className="text-sm text-gray-800">Learn more about the website.</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-6 ">
            <h2 className="text-2xl font-bold text-white">Games</h2>
            <p className="!mt-0 text-sm font-light text-gray-100">Test your skills</p>
            <Link to={pathName.STRIP_GAME}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Offline Strip Packing</h3>
                <p className="text-sm text-gray-800">Use the least amount of height and beat your opponent.</p>
              </div>
            </Link>
            <Link to={pathName.ONLINE_STRIP_GAME}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Online Strip Packing</h3>
                <p className="text-sm text-gray-800">You can only see a few items at a time, but the opponent can see non!</p>
              </div>
            </Link>
            <Link to={pathName.BIN_GAME}>
              <div className="max-w-sm p-5 transition rounded-md shadow bg-gray-50/80 hover:bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 ">Bin Packing</h3>
                <p className="text-sm text-gray-800">You have to use the least amount of bins.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
