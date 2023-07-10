import { useEffect, useRef } from 'react';
import * as React from 'react';

interface IUseTimerParams {
    onEnd: () => void;
    timerTick?: number;
}

interface IUseTimerReturn {
    start: (time: string) => void;
    stop: () => void;
    pause: () => void;
    timeLeft: number | null;
}

export const useTimer = ({ timerTick = 1000, onEnd }: IUseTimerParams): IUseTimerReturn => {
    const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
    const timer = useRef<number | null>(null);

    const start = React.useCallback((time: string) => {
        const startTime = Date.now();
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const msToTheEnd = timeLeft || (hours * 3600 + minutes * 60 + seconds) * 1000;
        const endTime = startTime + msToTheEnd ;
        let idealElapsedMs = 0;

        setTimeLeft(msToTheEnd);

        const timeoutFunction = () => {
            clearTimeout(timer.current);
            const realElapsedMs = Date.now() - startTime;

            if (realElapsedMs >= endTime - startTime) {
                setTimeLeft(0);
                onEnd();
                return;
            }

            idealElapsedMs = idealElapsedMs + timerTick;
            const tickBias = realElapsedMs - idealElapsedMs;

            setTimeLeft(endTime - startTime - idealElapsedMs);

            timer.current = window.setTimeout(timeoutFunction, timerTick - tickBias);
        }

        timer.current = window.setTimeout(timeoutFunction, timerTick);
    }, [timeLeft, timerTick, onEnd]);

    const stop = React.useCallback(() => {
        if (timer.current) {
            setTimeLeft(null);
            clearTimeout(timer.current);
        }
    }, []);

    const pause = React.useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        }
    }, []);

    return {
        start,
        stop,
        pause,
        timeLeft
    }
}
