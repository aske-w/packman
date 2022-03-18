import React, { useCallback, useEffect, useRef, useState } from 'react';
import create from 'zustand';
import { NAV_HEIGHT } from '../config/canvasConfig';
import useEventStore from '../store/event.store';
import { Events } from '../types/Events.enum';
import { RGBColor } from '../types/RGBColor.interface';

interface TimeBarProps {
  /**
   * Seconds
   */
  duration: number;
  targetFPS?: number;
  startColor?: RGBColor;
  endColor?: RGBColor;
}

const red: RGBColor = { /* tailwind bg-red-400*/ red: 240, green: 113, blue: 113 };
const green: RGBColor = { /* tailwind bg-green-400 */ red: 74, green: 222, blue: 128 };

const TimeBar: React.FC<TimeBarProps> = ({ duration, targetFPS = 60, startColor = green, endColor = red }) => {
  const barRef = useRef<HTMLDivElement>(null);
  // let loop: NodeJS.Timer
  const [loop, setLoop] = useState<NodeJS.Timer>();
  const [clientWidth, setClientWidth] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [barColor, setBarColor] = useState(startColor);
  const [tryStartFlag, setTryStartFlag] = useState(true);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const frameTime = 1000 / targetFPS; // 16,67 ms for 60 fps
  const subtractPerFrame = clientWidth / ((duration * 1000) / frameTime);
  const redChange = (endColor.red - startColor.red) / ((duration * 1000) / frameTime);
  const greenChange = (endColor.green - startColor.green) / ((duration * 1000) / frameTime);
  const blueChange = (endColor.blue - startColor.blue) / ((duration * 1000) / frameTime);

  const {event, setEvent} = useEventStore(useCallback(({ setEvent, event }) => ({setEvent, event}), []));

  // start the timer bar
  let start = () => {
    setTryStartFlag(prevState => {
      return !prevState;
    });
  };

  useEffect(() => {
    console.log("event useeffect");
    switch (event) {
      case Events.RECT_PLACED:
        console.log("Events.RECT_PLACED");
        if(!started){
          setStarted(true);
          // start();
        } else if(!gameOver){
          restart();
        }
        break;
      case Events.GAME_OVER:
        console.log("Events.GAME_OVER");
        setGameOver(true);
        break;
      case Events.FINISHED:
        reset();
        break;
      default:
        console.log("default: " + event);
        break;
    }
  }, [event, gameOver]);

  console.log({started});
  console.log({event});
  

  // reset timer to initial state without starting
  const reset = () => {
    setCurrentWidth(prevState => {
      clearInterval(loop!);
      barRef.current!.style.width = '100%';
      return clientWidth;
    });
    setBarColor(prevState => {
      barRef.current!.style.backgroundColor = `rgb(${startColor.red}, ${startColor.green}, ${startColor.blue})`;
      return startColor;
    });
  };

  // reset timer to initial state and start immediately, i.e. when a user places a rectangle within sufficient time.
  const restart = () => {
    setCurrentWidth(prevState => {
      return clientWidth;
    });
    setBarColor(prevState => {
      barRef.current!.style.backgroundColor = `rgb(${startColor.red}, ${startColor.green}, ${startColor.blue})`;
      return startColor;
    });
  };

  useEffect(() => {
    setClientWidth(barRef.current!.clientWidth);
    setCurrentWidth(barRef.current!.clientWidth);
    barRef.current!.style.backgroundColor = `rgb(${startColor.red}, ${startColor.green}, ${startColor.blue})`;
    barRef.current!.style.width = '100%';
  }, [barRef]);

  useEffect(() => {
    if (clientWidth == 0 || gameOver || !started || event !== Events.RECT_PLACED) return;
    const interval = setInterval(() => {
      setBarColor(prevState => {
        const newBG = {
          red: prevState.red + redChange,
          green: prevState.green + greenChange,
          blue: prevState.blue + blueChange,
        };
        barRef.current!.style.backgroundColor = `rgb(${newBG.red}, ${newBG.green}, ${newBG.blue})`;
        return newBG;
      });
      setCurrentWidth(prevState => {
        if (prevState <= 0) {
          setEvent(Events.GAME_OVER);
          barRef.current!.style.width = '0%';
          clearInterval(interval);
          return 0;
        }
        barRef.current!.style.width = `${((prevState - subtractPerFrame) / clientWidth) * 100}%`;
        return prevState - subtractPerFrame;
      });
    }, frameTime);
    setLoop(interval);
    setEvent(Events.RUNNING);
    return () => clearTimeout(loop!);
  }, [started, event]);

  return (
    <div style={{ top: NAV_HEIGHT }} className="w-full h-2 absolute z-10 overflow-hidden">
      <div className="h-full w-full">
        <div ref={barRef} className="h-full"></div>
      </div>
    </div>
  );
};

export default TimeBar;
