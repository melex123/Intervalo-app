import React, { useEffect } from 'react';
import { triggerConfetti } from '../../utils/confetti';
import './AMRAPWorkoutComplete.css';

const AMRAPWorkoutComplete = ({ completedRounds, totalDurationSec, totalReps, onDismiss }) => {
  useEffect(() => {
    triggerConfetti();
  }, []);

  const minutes = Math.floor(totalDurationSec / 60);

  return (
    <div className="amrap-complete-overlay">
      <div className="amrap-complete-modal">
        <div className="amrap-complete-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="var(--color-accent)" />
            <path d="M18 28L25 35L38 22" stroke="var(--color-text-on-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="amrap-complete-title">Workout Complete!</h1>
        <div className="amrap-complete-stats">
          <div className="amrap-complete-stat">
            <div className="amrap-complete-stat-value">{completedRounds}</div>
            <div className="amrap-complete-stat-label">Rounds</div>
          </div>
          <div className="amrap-complete-stat">
            <div className="amrap-complete-stat-value">{minutes}</div>
            <div className="amrap-complete-stat-label">Minutes</div>
          </div>
          {totalReps > 0 && (
            <div className="amrap-complete-stat">
              <div className="amrap-complete-stat-value">{totalReps}</div>
              <div className="amrap-complete-stat-label">Total Reps</div>
            </div>
          )}
        </div>
        <button className="amrap-complete-btn" onClick={onDismiss}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AMRAPWorkoutComplete;
