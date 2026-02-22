import React, { useRef, useEffect } from 'react';
import { EXERCISE_TYPES } from '../../models/workout';
import AMRAPExerciseCard from './AMRAPExerciseCard';
import './AMRAPExerciseList.css';

const AMRAPExerciseList = ({
  exercises,
  currentExerciseIndex,
  exerciseTimeRemaining,
  exerciseReps,
  formatTime,
  onAdjustReps,
  onPause,
  onResume,
  onDone,
  isPaused,
  completedRounds,
}) => {
  const activeCardRef = useRef(null);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentExerciseIndex, completedRounds]);

  // Build the visible card list:
  // - Previous exercises (from current round, those already completed)
  // - Active exercise
  // - Upcoming exercises
  const previousExercises = exercises.slice(0, currentExerciseIndex);
  const activeExercise = exercises[currentExerciseIndex];
  const upcomingExercises = exercises.slice(currentExerciseIndex + 1);

  return (
    <div className="amrap-exercise-list">
      {previousExercises.map((exercise, i) => (
        <AMRAPExerciseCard
          key={`prev-${i}`}
          exercise={exercise}
          variant="previous"
          formatTime={formatTime}
          repsCompleted={
            exercise.type === EXERCISE_TYPES.REPS
              ? (exerciseReps[i] !== undefined ? exerciseReps[i] : exercise.reps)
              : undefined
          }
          onAdjustReps={
            exercise.type === EXERCISE_TYPES.REPS
              ? (delta) => onAdjustReps(i, delta)
              : undefined
          }
        />
      ))}

      {activeExercise && (
        <div ref={activeCardRef}>
          <AMRAPExerciseCard
            exercise={activeExercise}
            variant="active"
            exerciseTimeRemaining={exerciseTimeRemaining}
            formatTime={formatTime}
            onPause={onPause}
            onResume={onResume}
            onDone={onDone}
            isPaused={isPaused}
          />
        </div>
      )}

      {upcomingExercises.map((exercise, i) => (
        <AMRAPExerciseCard
          key={`next-${i}`}
          exercise={exercise}
          variant="next"
          formatTime={formatTime}
        />
      ))}
    </div>
  );
};

export default AMRAPExerciseList;
