import React from 'react';
import './RepStepper.css';

const RepStepper = ({ value, onDecrement, onIncrement, variant = 'default' }) => {
  return (
    <div className={`rep-stepper rep-stepper--${variant}`}>
      <button
        className="rep-stepper-btn"
        onClick={(e) => { e.stopPropagation(); onDecrement(); }}
        aria-label="Decrease reps"
      >
        −
      </button>
      <span className="rep-stepper-value">{value}</span>
      <button
        className="rep-stepper-btn"
        onClick={(e) => { e.stopPropagation(); onIncrement(); }}
        aria-label="Increase reps"
      >
        +
      </button>
    </div>
  );
};

export default RepStepper;
