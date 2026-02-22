import { useState, useEffect, useCallback, useRef } from 'react';
import { EXERCISE_TYPES } from '../models/workout';
import { audioManager } from '../utils/audioManager';

export const AMRAP_PHASES = {
  IDLE: 'IDLE',
  PREP: 'PREP',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE',
};

const PREP_DURATION = 5000;
const TICK_INTERVAL = 100;

export const useAMRAPTimer = (workoutConfig) => {
  const { totalDuration: totalDurationSec, exercises } = workoutConfig || { totalDuration: 0, exercises: [] };
  const totalDuration = totalDurationSec * 1000;

  const [phase, setPhase] = useState(AMRAP_PHASES.IDLE);
  const [globalTimeRemaining, setGlobalTimeRemaining] = useState(totalDuration);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseTimeRemaining, setExerciseTimeRemaining] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [exerciseReps, setExerciseReps] = useState({});

  const phaseRef = useRef(phase);
  const globalTimeRef = useRef(globalTimeRemaining);
  const exerciseTimeRef = useRef(exerciseTimeRemaining);
  const exerciseIndexRef = useRef(currentExerciseIndex);
  const completedRoundsRef = useRef(completedRounds);
  const intervalRef = useRef(null);
  const exercisesRef = useRef(exercises);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { globalTimeRef.current = globalTimeRemaining; }, [globalTimeRemaining]);
  useEffect(() => { exerciseTimeRef.current = exerciseTimeRemaining; }, [exerciseTimeRemaining]);
  useEffect(() => { exerciseIndexRef.current = currentExerciseIndex; }, [currentExerciseIndex]);
  useEffect(() => { completedRoundsRef.current = completedRounds; }, [completedRounds]);
  useEffect(() => { exercisesRef.current = exercises; }, [exercises]);

  const currentExercise = exercises[currentExerciseIndex] || null;

  const getExerciseDuration = useCallback((exercise) => {
    if (!exercise) return 0;
    if (exercise.type === EXERCISE_TYPES.TIMED || exercise.type === EXERCISE_TYPES.REST) {
      return (exercise.duration || 0) * 1000;
    }
    return 0;
  }, []);

  const advanceExercise = useCallback(() => {
    const exs = exercisesRef.current;
    const nextIndex = exerciseIndexRef.current + 1;

    if (nextIndex >= exs.length) {
      setCompletedRounds(prev => prev + 1);
      setCurrentExerciseIndex(0);
      const firstEx = exs[0];
      setExerciseTimeRemaining(
        (firstEx.type === EXERCISE_TYPES.TIMED || firstEx.type === EXERCISE_TYPES.REST)
          ? (firstEx.duration || 0) * 1000
          : 0
      );
    } else {
      setCurrentExerciseIndex(nextIndex);
      const nextEx = exs[nextIndex];
      setExerciseTimeRemaining(
        (nextEx.type === EXERCISE_TYPES.TIMED || nextEx.type === EXERCISE_TYPES.REST)
          ? (nextEx.duration || 0) * 1000
          : 0
      );
    }
    audioManager.finalBeep();
  }, []);

  const tick = useCallback(() => {
    const currentPhase = phaseRef.current;

    if (currentPhase === AMRAP_PHASES.PREP) {
      setGlobalTimeRemaining(prev => {
        const newTime = prev - TICK_INTERVAL;
        if (newTime <= 3000 && newTime > 2900) {
          audioManager.prepBeep();
        }
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
      return;
    }

    if (currentPhase === AMRAP_PHASES.ACTIVE) {
      setGlobalTimeRemaining(prev => {
        const newTime = prev - TICK_INTERVAL;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });

      const exs = exercisesRef.current;
      const exIdx = exerciseIndexRef.current;
      const ex = exs[exIdx];

      if (ex && (ex.type === EXERCISE_TYPES.TIMED || ex.type === EXERCISE_TYPES.REST)) {
        setExerciseTimeRemaining(prev => {
          const newTime = prev - TICK_INTERVAL;
          if (newTime <= 3000 && newTime > 2900 && prev > 3000) {
            audioManager.prepBeep();
          }
          if (newTime <= 0) {
            return 0;
          }
          return newTime;
        });
      }
    }
  }, []);

  // Handle global timer hitting zero -> COMPLETE
  useEffect(() => {
    if (phase === AMRAP_PHASES.ACTIVE && globalTimeRemaining <= 0) {
      setPhase(AMRAP_PHASES.COMPLETE);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      audioManager.finalBeep();
    }
  }, [globalTimeRemaining, phase]);

  // Handle prep timer hitting zero -> start ACTIVE
  useEffect(() => {
    if (phase === AMRAP_PHASES.PREP && globalTimeRemaining <= 0) {
      setPhase(AMRAP_PHASES.ACTIVE);
      setGlobalTimeRemaining(totalDuration);
      const firstEx = exercises[0];
      if (firstEx) {
        setExerciseTimeRemaining(getExerciseDuration(firstEx));
      }
      audioManager.finalBeep();
    }
  }, [globalTimeRemaining, phase, totalDuration, exercises, getExerciseDuration]);

  // Handle exercise timer hitting zero -> advance
  useEffect(() => {
    if (phase !== AMRAP_PHASES.ACTIVE) return;
    if (globalTimeRemaining <= 0) return;

    const ex = exercises[currentExerciseIndex];
    if (!ex) return;

    if ((ex.type === EXERCISE_TYPES.TIMED || ex.type === EXERCISE_TYPES.REST) && exerciseTimeRemaining <= 0 && getExerciseDuration(ex) > 0) {
      advanceExercise();
    }
  }, [exerciseTimeRemaining, phase, currentExerciseIndex, exercises, globalTimeRemaining, advanceExercise, getExerciseDuration]);

  // Interval management
  useEffect(() => {
    if (phase === AMRAP_PHASES.PREP || phase === AMRAP_PHASES.ACTIVE) {
      intervalRef.current = setInterval(tick, TICK_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phase, tick]);

  const start = useCallback(() => {
    setPhase(AMRAP_PHASES.PREP);
    setGlobalTimeRemaining(PREP_DURATION);
    setCurrentExerciseIndex(0);
    setExerciseTimeRemaining(0);
    setCompletedRounds(0);
    setExerciseReps({});
  }, []);

  const pause = useCallback(() => {
    if (phaseRef.current === AMRAP_PHASES.ACTIVE) {
      setPhase(AMRAP_PHASES.PAUSED);
    }
  }, []);

  const resume = useCallback(() => {
    if (phaseRef.current === AMRAP_PHASES.PAUSED) {
      setPhase(AMRAP_PHASES.ACTIVE);
    }
  }, []);

  const stop = useCallback(() => {
    setPhase(AMRAP_PHASES.IDLE);
    setGlobalTimeRemaining(totalDuration);
    setCurrentExerciseIndex(0);
    setExerciseTimeRemaining(0);
    setCompletedRounds(0);
    setExerciseReps({});
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [totalDuration]);

  const markExerciseDone = useCallback(() => {
    if (phaseRef.current !== AMRAP_PHASES.ACTIVE) return;
    advanceExercise();
  }, [advanceExercise]);

  const adjustReps = useCallback((exerciseIndex, delta) => {
    setExerciseReps(prev => {
      const current = prev[exerciseIndex] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [exerciseIndex]: newVal };
    });
  }, []);

  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const progressFraction = phase === AMRAP_PHASES.ACTIVE || phase === AMRAP_PHASES.PAUSED || phase === AMRAP_PHASES.COMPLETE
    ? 1 - (globalTimeRemaining / totalDuration)
    : 0;

  return {
    phase,
    globalTimeRemaining,
    totalDuration,
    progressFraction: Math.min(1, Math.max(0, progressFraction)),
    currentExerciseIndex,
    currentExercise,
    exerciseTimeRemaining,
    completedRounds,
    exerciseReps,
    exercises,
    start,
    pause,
    resume,
    stop,
    markExerciseDone,
    adjustReps,
    formatTime,
  };
};
