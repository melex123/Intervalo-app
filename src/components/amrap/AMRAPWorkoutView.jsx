import React, { useMemo } from 'react';
import { useAMRAPTimer, AMRAP_PHASES } from '../../hooks/useAMRAPTimer';
import { EXERCISE_TYPES } from '../../models/workout';
import AMRAPProgressBar from './AMRAPProgressBar';
import AMRAPHeader from './AMRAPHeader';
import FlipClockTimer from './FlipClockTimer';
import AMRAPExerciseIndicators from './AMRAPExerciseIndicators';
import AMRAPExerciseList from './AMRAPExerciseList';
import AMRAPWorkoutComplete from './AMRAPWorkoutComplete';
import './AMRAPWorkoutView.css';

const AMRAPWorkoutView = ({ config, onStop }) => {
  const {
    phase,
    globalTimeRemaining,
    progressFraction,
    currentExerciseIndex,
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
  } = useAMRAPTimer(config);

  const handleStop = () => {
    stop();
    onStop();
  };

  // Auto-start when mounted
  React.useEffect(() => {
    if (phase === AMRAP_PHASES.IDLE) {
      start();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nonRestExercises = useMemo(
    () => exercises.filter((e) => e.type !== EXERCISE_TYPES.REST),
    [exercises]
  );
  const exerciseCount = nonRestExercises.length;

  // Compute current non-REST exercise position for the indicator
  const currentExercise = exercises[currentExerciseIndex];
  let nonRestIndex;
  if (currentExercise && currentExercise.type === EXERCISE_TYPES.REST) {
    // During rest, show the total (all exercises done this round)
    nonRestIndex = exerciseCount - 1;
  } else {
    // Count how many non-REST exercises come before this index
    nonRestIndex = exercises
      .slice(0, currentExerciseIndex)
      .filter((e) => e.type !== EXERCISE_TYPES.REST).length;
  }

  const isPaused = phase === AMRAP_PHASES.PAUSED;
  const isPrep = phase === AMRAP_PHASES.PREP;
  const isComplete = phase === AMRAP_PHASES.COMPLETE;

  // Calculate total reps for completion screen
  const totalReps = Object.values(exerciseReps).reduce((sum, r) => sum + r, 0);

  return (
    <div className="amrap-workout-view">
      <AMRAPProgressBar progressFraction={progressFraction} />

      <AMRAPHeader
        totalDurationSec={config.totalDuration}
        onStop={handleStop}
      />

      {isPrep ? (
        <div className="amrap-prep-overlay">
          <div className="amrap-prep-label">GET READY</div>
          <div className="amrap-prep-countdown">
            {Math.ceil(globalTimeRemaining / 1000)}
          </div>
        </div>
      ) : (
        <>
          <FlipClockTimer timeMs={globalTimeRemaining} />

          <AMRAPExerciseIndicators
            currentIndex={nonRestIndex}
            totalExercises={exerciseCount}
            completedRounds={completedRounds}
          />

          <AMRAPExerciseList
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            exerciseTimeRemaining={exerciseTimeRemaining}
            exerciseReps={exerciseReps}
            formatTime={formatTime}
            onAdjustReps={adjustReps}
            onPause={pause}
            onResume={resume}
            onDone={markExerciseDone}
            isPaused={isPaused}
            completedRounds={completedRounds}
          />
        </>
      )}

      {isComplete && (
        <AMRAPWorkoutComplete
          completedRounds={completedRounds}
          totalDurationSec={config.totalDuration}
          totalReps={totalReps}
          onDismiss={handleStop}
        />
      )}
    </div>
  );
};

export default AMRAPWorkoutView;
