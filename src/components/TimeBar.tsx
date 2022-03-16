import React, { useEffect, useRef } from "react";
import create from "zustand"

interface TimeBarProps {
    navbarHeight: number;
}

interface TimeBarState {
    running: boolean;
    duration: number;
    observers: (() => void)[];
    visible: boolean;
    stopped: boolean;
    setVisible: (value: boolean) => void;
    start: () => void;
    /**
     * Reset time and start timer immediately, optionally notifying observers
     */
    resetTime: (notifyObsevers?: boolean) => void;
    setDuration: (duration: number) => void;
    /**
     * Observers, notified when time runs out
     */
    setObservers: (observer: (() => void)[]) => void;
    setRunning: (value: boolean) => void;
    setStopped: (value: boolean) => void;
}

export const useTimeBar = create<TimeBarState>((set) => ({
    running: false,
    stopped: true,
    duration: 10,
    observers: [],
    visible: false,
    start: () => set((state) => ({running: true, stopped: false})),
    resetTime: () => set((state) => ({})),
    setDuration: (newDuration: number) => set((state) => ({duration: newDuration})),
    setObservers: (o: (() => void)[]) => set((state) => ({observers: o})),
    setVisible: (value: boolean) => set((state) => ({visible: value})),
    setRunning: (value: boolean) => set((state) => ({running: value})),
    setStopped: (value: boolean) => set((state) => ({stopped: value}))
}));

const TimeBar: React.FC<TimeBarProps> = ({ navbarHeight}) => {
    let barRef = useRef<HTMLDivElement>(null);
    console.log(barRef.current?.clientWidth);
    const {visible, running, stopped, duration, observers,start, setRunning, setStopped} = useTimeBar()

    const notify = () => observers.forEach(o => o());

    useEffect(() => {
        if(!stopped)
            return;
            
        setRunning(false)
        console.log("resettime called");
        if(notifyTimer) 
            clearTimeout(notifyTimer);
        
        notify();
    },[stopped]);

    let notifyTimer: NodeJS.Timeout | undefined;
    useEffect(() => {
        if(running && !stopped) {
            barRef.current!.style.transitionTimingFunction = "";
            // barRef.current!.classList.add("transition-all");
            barRef.current!.classList.replace("bg-green-400", "bg-red-400");
            barRef.current!.classList.replace("w-full", "w-0");
            notifyTimer = setTimeout(() => {
                setStopped(true)
            }, duration * 1000);
            return () => clearTimeout(notifyTimer!)
        } else {
            barRef.current!.style.transitionTimingFunction = "step-start";
            // barRef.current!.classList.remove("transition-all");
            barRef.current!.classList.replace("w-0", "w-full");
            barRef.current!.classList.replace("bg-red-400", "bg-green-400");
        }
    }, [running]);
    
    return <div
        style={{ top: navbarHeight }}
        className="w-full h-2 absolute z-10 overflow-hidden">
        <div onClick={e => {
            start()
        }}
            className="h-full w-full">
                <div ref={barRef}
                style={{transitionDuration: `${duration * 1000}ms`}}
                className={`h-full w-full transition-all bg-green-400 ease-linear ${visible ? "" : "hidden"}`}>
            </div>
        </div>
    </div>;
};

export default TimeBar;
