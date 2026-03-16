import React, { useState } from 'react';
import { EXERCISE_TYPES } from '../models/workout';
import './WorkoutBuilder.css';

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} min`;
  return `${mins}m ${secs}s`;
};

const ChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WorkoutBuilder = ({ onSave, onSaveAndStart, onBack }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [rounds, setRounds] = useState(5);
  const [roundMinutes, setRoundMinutes] = useState(1);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);
  const [errors, setErrors] = useState({});

  const roundDuration = roundMinutes * 60 + roundSeconds;
  const totalDuration = rounds * roundDuration + (rounds - 1) * restSeconds;

  const validate = () => {
    const newErrors = {};
    if (!workoutName.trim()) newErrors.name = true;
    if (rounds < 1) newErrors.rounds = true;
    if (roundDuration < 10) newErrors.roundDuration = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWorkoutConfig = () => {
    const exercises = [];
    for (let i = 0; i < rounds; i++) {
      exercises.push({
        id: `round-${i}`,
        name: `Round ${i + 1}`,
        type: EXERCISE_TYPES.TIMED,
        duration: roundDuration,
      });
      if (i < rounds - 1 && restSeconds > 0) {
        exercises.push({
          id: `rest-${i}`,
          name: 'Rest',
          type: EXERCISE_TYPES.REST,
          duration: restSeconds,
        });
      }
    }
    return {
      name: workoutName.trim(),
      totalDuration,
      exercises,
    };
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(buildWorkoutConfig());
  };

  const handleSaveAndStart = () => {
    if (!validate()) return;
    onSaveAndStart(buildWorkoutConfig());
  };

  const adjustValue = (setter, current, delta, min, max) => {
    setter(Math.max(min, Math.min(max, current + delta)));
  };

  return (
    <div className="builder">
      <div className="builder-header">
        <button className="builder-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="builder-title">Create Workout</h1>
        <div style={{ width: 36 }} />
      </div>

      <div className="builder-form">
        {/* Workout Name */}
        <div className="builder-section">
          <label className="builder-label">Workout Name</label>
          <input
            type="text"
            className={`builder-input ${errors.name ? 'builder-input-error' : ''}`}
            placeholder="e.g. Morning Intervals"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        {/* Rounds */}
        <div className="builder-section">
          <label className="builder-label">Rounds</label>
          <div className="builder-stepper">
            <button
              className="builder-stepper-btn"
              onClick={() => adjustValue(setRounds, rounds, -1, 1, 50)}
            >
              −
            </button>
            <span className={`builder-stepper-value ${errors.rounds ? 'error' : ''}`}>
              {rounds}
            </span>
            <button
              className="builder-stepper-btn"
              onClick={() => adjustValue(setRounds, rounds, 1, 1, 50)}
            >
              +
            </button>
          </div>
        </div>

        {/* Round Duration */}
        <div className="builder-section">
          <label className="builder-label">Round Duration</label>
          <div className="builder-time-picker">
            <div className="builder-time-col">
              <button
                className="builder-time-arrow"
                onClick={() => adjustValue(setRoundMinutes, roundMinutes, 1, 0, 10)}
              >
                <ChevronUp />
              </button>
              <span className={`builder-time-value ${errors.roundDuration ? 'error' : ''}`}>
                {String(roundMinutes).padStart(2, '0')}
              </span>
              <button
                className="builder-time-arrow"
                onClick={() => adjustValue(setRoundMinutes, roundMinutes, -1, 0, 10)}
              >
                <ChevronDown />
              </button>
              <span className="builder-time-unit">min</span>
            </div>
            <span className="builder-time-sep">:</span>
            <div className="builder-time-col">
              <button
                className="builder-time-arrow"
                onClick={() => adjustValue(setRoundSeconds, roundSeconds, 5, 0, 55)}
              >
                <ChevronUp />
              </button>
              <span className={`builder-time-value ${errors.roundDuration ? 'error' : ''}`}>
                {String(roundSeconds).padStart(2, '0')}
              </span>
              <button
                className="builder-time-arrow"
                onClick={() => adjustValue(setRoundSeconds, roundSeconds, -5, 0, 55)}
              >
                <ChevronDown />
              </button>
              <span className="builder-time-unit">sec</span>
            </div>
          </div>
        </div>

        {/* Rest Between Rounds */}
        <div className="builder-section">
          <label className="builder-label">Rest Between Rounds</label>
          <div className="builder-rest-presets">
            {[0, 15, 30, 45, 60, 90].map((s) => (
              <button
                key={s}
                className={`builder-rest-btn ${restSeconds === s ? 'active' : ''}`}
                onClick={() => setRestSeconds(s)}
              >
                {s === 0 ? 'None' : `${s}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Total Duration Summary */}
        <div className="builder-summary">
          <div className="builder-summary-row">
            <span className="builder-summary-label">Total Duration</span>
            <span className="builder-summary-value">{formatTime(totalDuration)}</span>
          </div>
          <div className="builder-summary-detail">
            {rounds}× {formatTime(roundDuration)} round
            {restSeconds > 0 ? ` + ${restSeconds}s rest` : ''}
          </div>
        </div>
      </div>

      <div className="builder-actions">
        <button className="builder-save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="builder-start-btn" onClick={handleSaveAndStart}>
          Save & Start
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
