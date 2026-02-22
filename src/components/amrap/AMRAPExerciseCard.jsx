import React from 'react';
import { EXERCISE_TYPES } from '../../models/workout';
import RepStepper from './RepStepper';
import './AMRAPExerciseCard.css';

const AMRAPExerciseCard = ({
  exercise,
  variant = 'next',
  exerciseTimeRemaining,
  formatTime,
  repsCompleted,
  onAdjustReps,
  onPause,
  onResume,
  onDone,
  isPaused,
}) => {
  const isActive = variant === 'active';
  const isPrevious = variant === 'previous';
  const isNext = variant === 'next';
  const isRest = exercise.type === EXERCISE_TYPES.REST;
  const isTimed = exercise.type === EXERCISE_TYPES.TIMED;
  const isReps = exercise.type === EXERCISE_TYPES.REPS;

  if (isNext) {
    return (
      <div className={`exercise-card exercise-card--next ${isRest ? 'exercise-card--rest' : ''}`}>
        <div className="exercise-card-content">
          <span className="exercise-card-name">
            {isRest ? 'Rest' : exercise.name}
          </span>
          {(isTimed || isRest) && (
            <span className="exercise-card-timer-preview">
              {formatTime((exercise.duration || 0) * 1000)}
            </span>
          )}
          {isReps && (
            <span className="exercise-card-reps-preview">
              {exercise.reps} reps
            </span>
          )}
        </div>
      </div>
    );
  }

  if (isPrevious) {
    return (
      <div className="exercise-card exercise-card--previous">
        <div className="exercise-card-content">
          <div className="exercise-card-left">
            {isReps && (
              <span className="exercise-card-rep-count">{repsCompleted || exercise.reps || 0}</span>
            )}
            {isTimed && (
              <span className="exercise-card-check">&#10003;</span>
            )}
            <span className="exercise-card-name">{isRest ? 'Rest' : exercise.name}</span>
          </div>
          {isReps && onAdjustReps && (
            <RepStepper
              value={repsCompleted || exercise.reps || 0}
              onDecrement={() => onAdjustReps(-1)}
              onIncrement={() => onAdjustReps(1)}
            />
          )}
        </div>
      </div>
    );
  }

  // Active variant
  return (
    <div className={`exercise-card exercise-card--active ${isRest ? 'exercise-card--active-rest' : ''}`}>
      <div className="exercise-card-active-header">
        {isReps && <span className="exercise-card-active-reps">{exercise.reps}</span>}
        <span className="exercise-card-active-name">
          {isRest ? 'Rest' : exercise.name}
        </span>
      </div>

      {(isTimed || isRest) && (
        <div className="exercise-card-active-timer">
          {formatTime(exerciseTimeRemaining)}
        </div>
      )}

      <div className="exercise-card-active-controls">
        <button
          className="exercise-card-pause-btn"
          onClick={isPaused ? onResume : onPause}
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="6,3 18,10 6,17" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>

        <button className="exercise-card-done-btn" onClick={onDone}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M2 4L5 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 4L9 8L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </button>
      </div>
    </div>
  );
};

export default AMRAPExerciseCard;
