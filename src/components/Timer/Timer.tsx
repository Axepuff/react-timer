import * as React from 'react';
import { ChangeEvent } from 'react';
import './Timer.css';
import { useTimer } from './useTimer';

export const Timer: React.FC = () => {
    const [timerState, setTimerState] = React.useState<
        'initial' | 'inProgress' | 'finish' | 'pause'
    >('initial');

    const formRef = React.useRef<HTMLFormElement | null>(null);

    const resetTimer = () => {
        if (formRef.current) {
            formRef.current.time.value = '00:00:00';
        }
    };

    const onEnd = () => {
        setTimerState('finish');
    }

    const { start, stop, pause, timeLeft } = useTimer({ onEnd });

    const onStart = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const time = e.target.time.value;

        if (!time || time === '00:00:00' || timerState === 'inProgress') {
            return;
        }

        setTimerState('inProgress');
        start(time);
    }

    const onStop = React.useCallback(() => {
        setTimerState('initial');
        stop();
    }, [stop]);

    const onReset = () => {
        setTimerState('initial');
        onStop();
        resetTimer();
    }

    const onPause = () => {
        setTimerState('pause');
        pause();
    }

    const timerStateString = React.useMemo(() => {
        if (typeof timeLeft === 'number') {
            return new Date(timeLeft).toISOString().slice(11, 19);
        }
    }, [timeLeft]);

    return (
        <form onSubmit={onStart} className="timer-form" ref={formRef}>
            <label className="facetime">
                <input
                    id="timer-form"
                    type="time"
                    name="time"
                    step="1"
                    defaultValue="00:00:00"
                />
            </label>
            <button
                className="timer-button"
                type="submit"
                name="startTimer"
            >
                Start
            </button>
            <button
                className="timer-button"
                type="button"
                name="stopTimer"
                value="Stop"
                onClick={onStop}
            >
                Stop
            </button>
            <button
                className="timer-button"
                type="button"
                name="pauseTimer"
                onClick={onPause}
            >
                Pause
            </button>
            <button
                className="timer-button"
                type="button"
                name="clearTimer"
                onClick={onReset}
            >
                Clear
            </button>
            <div className="time-left">
                <span>{timerStateString}</span>
            </div>
            {timerState === 'finish' && 'ЗАВЕРШЕНО!'}
        </form>
    );
};

Timer.displayName = 'Timer';
