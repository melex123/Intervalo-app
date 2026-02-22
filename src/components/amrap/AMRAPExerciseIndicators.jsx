import React from 'react';
import './AMRAPExerciseIndicators.css';

const AMRAPExerciseIndicators = ({ currentIndex, totalExercises, completedRounds }) => {
  return (
    <div className="amrap-indicators">
      <div className="amrap-indicator">
        <span className="amrap-indicator-value">
          {currentIndex + 1}/{totalExercises}
        </span>
        <span className="amrap-indicator-label">EXERCISES</span>
      </div>
      <div className="amrap-indicator">
        <div className="amrap-indicator-round">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="amrap-round-icon">
            <path
              d="M13.5 8a5.5 5.5 0 0 1-9.9 3.3M2.5 8a5.5 5.5 0 0 1 9.9-3.3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M3.5 14V11.3H6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 2V4.7H9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="amrap-indicator-value">{completedRounds}</span>
        </div>
        <span className="amrap-indicator-label">ROUNDS</span>
      </div>
    </div>
  );
};

export default AMRAPExerciseIndicators;
