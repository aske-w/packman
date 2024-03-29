import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NAV_HEIGHT } from '../config/canvasConfig';
import useEventStore from '../store/event.store';
import useLevelStore from '../store/level.store';
import useScoreStore from '../store/score.store';
import { Events } from '../types/enums/Events.enum';
import { Levels } from '../types/enums/Levels.enum';
import { RGBColor } from '../types/RGBColor.interface';

interface TimeBarProps {
  /**
   * Seconds
   */
  targetFPS?: number;
  startColor?: RGBColor;
  endColor?: RGBColor;
}

const red: RGBColor = { /* tailwind bg-red-400*/ red: 240, green: 113, blue: 113 };
const green: RGBColor = { /* tailwind bg-green-400 */ red: 74, green: 222, blue: 128 };

const TimeBar: React.FC<TimeBarProps> = ({ targetFPS = 60, startColor = green, endColor = red }) => {
  const barRef = useRef<HTMLDivElement>(null);

  const [loop, setLoop] = useState<NodeJS.Timer>();
  const [clientWidth, setClientWidth] = useState(0);
  const [percentTimeLeftWhenRestarted, setPercentTimeLeftWhenRestarted] = useState<number[]>();
  const [restartCount, setRestartCount] = useState<number>();
  const currWidth = useRef(0);

  const { event, setEvent } = useEventStore(useCallback(({ setEvent, event }) => ({ setEvent, event }), []));
  const { setAverageTimeUsed } = useScoreStore();
  const { level, permission } = useLevelStore(useCallback(({ level, getPermission }) => ({ level, permission: getPermission() }), []));

  const duration = permission?.time ?? 1;
  const frameTime = 1000 / targetFPS; // 16,67 ms for 60 fps
  const subtractPerFrame = clientWidth / ((duration * 1000) / frameTime);
  const redChange = (endColor.red - startColor.red) / ((duration * 1000) / frameTime);
  const greenChange = (endColor.green - startColor.green) / ((duration * 1000) / frameTime);
  const blueChange = (endColor.blue - startColor.blue) / ((duration * 1000) / frameTime);

  // reset timer to initial state without starting
  const reset = (color = startColor) => {
    clearInterval(loop!);
    barRef.current!.style.width = '100%';
    barRef.current!.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
    currWidth.current = clientWidth;
  };

  const finish = (color?: RGBColor) => {
    const avgTimeUsed =
      percentTimeLeftWhenRestarted!.reduce((prev, curr) => prev + curr, (currWidth.current / clientWidth) * 100) / (restartCount! + 1);
    setAverageTimeUsed(avgTimeUsed);
    setPercentTimeLeftWhenRestarted(undefined);
    setRestartCount(undefined);
    clearInterval(loop!);
    currWidth.current = clientWidth;
    color && (barRef.current!.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`);
  };

  const avg = useCallback(() => {
    if (level == Levels.BEGINNER) console.log('avg && beginner');
    if (restartCount == undefined) {
      setRestartCount(0);
    } else {
      setRestartCount(restartCount + 1);
    }
    if (percentTimeLeftWhenRestarted == undefined) {
      setPercentTimeLeftWhenRestarted([]);
    } else {
      setPercentTimeLeftWhenRestarted([...percentTimeLeftWhenRestarted!, (currWidth.current / clientWidth) * 100]);
      setAverageTimeUsed(
        [...percentTimeLeftWhenRestarted!, (currWidth.current / clientWidth) * 100].reduce(
          (prev, curr) => prev + curr,
          (currWidth.current / clientWidth) * 100
        ) /
          (restartCount! + 1)
      );
    }
  }, [clientWidth, percentTimeLeftWhenRestarted, currWidth]);

  // reset timer to initial state and start immediately, i.e. when a user places a rectangle within sufficient time.
  const restart = () => {
    avg();
    clearInterval(loop!);
    currWidth.current = clientWidth;
    barRef.current!.style.backgroundColor = `rgb(${startColor.red}, ${startColor.green}, ${startColor.blue})`;
  };

  useEffect(() => {
    if (permission?.time === undefined) return;
    setClientWidth(barRef.current!.clientWidth);
    currWidth.current = barRef.current!.clientWidth;
    barRef.current!.style.backgroundColor = `rgb(${startColor.red}, ${startColor.green}, ${startColor.blue})`;
    barRef.current!.style.width = '100%';
  }, [barRef, permission]);

  useEffect(() => {
    if (clientWidth == 0 || permission?.time === undefined) return;
    switch (event) {
      case Events.FINISHED:
        finish();
        break;

      case Events.GAME_OVER:
        finish({ ...red });
        break;

      case Events.IDLE:
        reset();
        break;

      case Events.RECT_PLACED:
        setEvent(Events.RUNNING);
        restart();

        const timebarBg = { ...startColor };

        const interval = setInterval(() => {
          timebarBg.red = timebarBg.red + redChange;
          timebarBg.green = timebarBg.green + greenChange;
          timebarBg.blue = timebarBg.blue + blueChange;

          barRef.current!.style.backgroundColor = `rgb(${timebarBg.red}, ${timebarBg.green}, ${timebarBg.blue})`;

          const prevWidth = currWidth.current;
          if (prevWidth <= 0) {
            setEvent(Events.GAME_OVER);
            barRef.current!.style.width = '0%';
            clearInterval(interval);
            return;
          }
          barRef.current!.style.width = `${((prevWidth - subtractPerFrame) / clientWidth) * 100}%`;
          currWidth.current = prevWidth - subtractPerFrame;
        }, frameTime);
        setLoop(interval);

        return () => loop && clearInterval(loop);
      default:
        return () => loop && clearInterval(loop);
    }
  }, [event, permission]);

  return useMemo(
    () =>
      permission.time ? (
        <div style={{ top: NAV_HEIGHT }} className={`w-full h-2 absolute z-10 overflow-hidden`}>
          <div className="w-full h-full">
            <div ref={barRef} className="h-full"></div>
          </div>
        </div>
      ) : null,
    [barRef, permission]
  );
};

export default TimeBar;
