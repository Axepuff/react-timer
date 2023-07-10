import * as React from 'react';
import { ChangeEvent } from 'react';
import './Timer.css';
import { useTimer } from './useTimer';

export const Timer: React.FC = () => {
    const [formState, setFormState] = React.useState<
        'initial' | 'inProgress' | 'finish' | 'pause'
    >('initial');

    const formRef = React.useRef<HTMLFormElement | null>(null);

    const resetTimer = () => {
        if (formRef.current) {
            formRef.current.time.value = '00:00:00';
        }
    };

    const onEnd = React.useCallback(() => {
        setFormState('finish');
    }, []);

    const { start, stop, pause, timeLeft } = useTimer({ onEnd });

    const onStart = React.useCallback((e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const time = e.target.time.value;

        if (!time || time === '00:00:00' || formState === 'inProgress') {
            return;
        }

        setFormState('inProgress');
        start(time);
    }, [start, formState]);

    const onStop = React.useCallback(() => {
        setFormState('initial');
        stop();
    }, [stop]);

    const onReset = React.useCallback(() => {
        setFormState('initial');
        onStop();
        resetTimer();
    }, [onStop]);

    const onPause = React.useCallback(() => {
        setFormState('pause');
        pause();
    }, [pause]);

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
            <input
                className="timer-button"
                type="submit"
                name="startTimer"
                value="Start"
            />
            <input
                className="timer-button"
                type="button"
                name="stopTimer"
                value="Stop"
                onClick={onStop}
            />
            <input
                className="timer-button"
                type="button"
                name="pauseTimer"
                value="Pause"
                onClick={onPause}
            />
            <input
                className="timer-button"
                type="button"
                name="clearTimer"
                value="Clear"
                onClick={onReset}
            />
            <div className="time-left">
                <span>{timerStateString}</span>
            </div>
            {formState === 'finish' && 'ЗАВЕРШЕНО!'}
        </form>
    );
};

Timer.displayName = 'Timer';
