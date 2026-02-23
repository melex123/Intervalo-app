import React, { useState } from 'react';
import { EXERCISE_TYPES } from '../models/workout';
import './WorkoutBuilder.css';

const DURATION_PRESETS = [8, 12, 16, 20];

const createBlankExercise = () => ({
  id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
  name: '',
  type: EXERCISE_TYPES.REPS,
  reps: 10,
  duration: 30,
});

const createRestExercise = () => ({
  id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
  name: 'Rest',
  type: EXERCISE_TYPES.REST,
  duration: 30,
});

const WorkoutBuilder = ({ onSave, onSaveAndStart, onBack }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(12);
  const [customMinutes, setCustomMinutes] = useState('');
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [exercises, setExercises] = useState([createBlankExercise()]);
  const [errors, setErrors] = useState({});

  const effectiveMinutes = useCustomDuration ? Number(customMinutes) || 0 : totalMinutes;

  const validate = () => {
    const newErrors = {};
    if (!workoutName.trim()) newErrors.name = true;
    if (effectiveMinutes < 1) newErrors.duration = true;
    const nonRestExercises = exercises.filter((e) => e.type !== EXERCISE_TYPES.REST);
    if (nonRestExercises.length === 0) newErrors.exercises = 'Add at least one exercise';
    nonRestExercises.forEach((e) => {
      if (!e.name.trim()) newErrors[`ex-${e.id}`] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWorkoutConfig = () => ({
    name: workoutName.trim(),
    totalDuration: effectiveMinutes * 60,
    exercises: exercises.map((e) => {
      const base = { id: e.id, name: e.name.trim() || 'Rest', type: e.type };
      if (e.type === EXERCISE_TYPES.REPS) base.reps = e.reps;
      else base.duration = e.duration;
      return base;
    }),
  });

  const handleSave = () => {
    if (!validate()) return;
    onSave(buildWorkoutConfig());
  };

  const handleSaveAndStart = () => {
    if (!validate()) return;
    onSaveAndStart(buildWorkoutConfig());
  };

  const updateExercise = (id, updates) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const removeExercise = (id) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, createBlankExercise()]);
  };

  const addRest = () => {
    setExercises((prev) => [...prev, createRestExercise()]);
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
        <div className="builder-section">
          <label className="builder-label">Workout Name</label>
          <input
            type="text"
            className={`builder-input ${errors.name ? 'builder-input-error' : ''}`}
            placeholder="e.g. Morning Burn"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        <div className="builder-section">
          <label className="builder-label">Duration (minutes)</label>
          <div className="builder-duration-row">
            {DURATION_PRESETS.map((min) => (
              <button
                key={min}
                className={`builder-duration-btn ${!useCustomDuration && totalMinutes === min ? 'active' : ''}`}
                onClick={() => {
                  setTotalMinutes(min);
                  setUseCustomDuration(false);
                }}
              >
                {min}
              </button>
            ))}
            <input
              type="number"
              className={`builder-duration-custom ${useCustomDuration ? 'active' : ''} ${errors.duration ? 'builder-input-error' : ''}`}
              placeholder="Custom"
              value={customMinutes}
              min="1"
              max="60"
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                setUseCustomDuration(true);
              }}
              onFocus={() => setUseCustomDuration(true)}
            />
          </div>
        </div>

        <div className="builder-section">
          <label className="builder-label">Exercises</label>
          {errors.exercises && (
            <p className="builder-error-text">{errors.exercises}</p>
          )}
          <div className="builder-exercises">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="builder-exercise-row">
                <span className="builder-exercise-num">{index + 1}</span>

                {exercise.type === EXERCISE_TYPES.REST ? (
                  <div className="builder-exercise-rest-row">
                    <span className="builder-exercise-rest-label">Rest</span>
                    <div className="builder-exercise-duration-input">
                      <input
                        type="number"
                        value={exercise.duration}
                        min="5"
                        max="300"
                        onChange={(e) =>
                          updateExercise(exercise.id, {
                            duration: Math.max(5, Number(e.target.value) || 5),
                          })
                        }
                      />
                      <span className="builder-exercise-unit">sec</span>
                    </div>
                  </div>
                ) : (
                  <div className="builder-exercise-fields">
                    <input
                      type="text"
                      className={`builder-exercise-name ${errors[`ex-${exercise.id}`] ? 'builder-input-error' : ''}`}
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(exercise.id, { name: e.target.value })
                      }
                    />
                    <div className="builder-exercise-type-row">
                      <div className="builder-type-toggle">
                        {[EXERCISE_TYPES.REPS, EXERCISE_TYPES.TIMED].map((t) => (
                          <button
                            key={t}
                            className={`builder-type-btn ${exercise.type === t ? 'active' : ''}`}
                            onClick={() => updateExercise(exercise.id, { type: t })}
                          >
                            {t === EXERCISE_TYPES.REPS ? 'Reps' : 'Timed'}
                          </button>
                        ))}
                      </div>
                      {exercise.type === EXERCISE_TYPES.REPS ? (
                        <div className="builder-exercise-value-input">
                          <input
                            type="number"
                            value={exercise.reps}
                            min="1"
                            max="999"
                            onChange={(e) =>
                              updateExercise(exercise.id, {
                                reps: Math.max(1, Number(e.target.value) || 1),
                              })
                            }
                          />
                          <span className="builder-exercise-unit">reps</span>
                        </div>
                      ) : (
                        <div className="builder-exercise-value-input">
                          <input
                            type="number"
                            value={exercise.duration}
                            min="5"
                            max="300"
                            onChange={(e) =>
                              updateExercise(exercise.id, {
                                duration: Math.max(5, Number(e.target.value) || 5),
                              })
                            }
                          />
                          <span className="builder-exercise-unit">sec</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="builder-exercise-delete"
                  onClick={() => removeExercise(exercise.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="builder-add-row">
            <button className="builder-add-btn" onClick={addExercise}>
              + Exercise
            </button>
            <button className="builder-add-rest-btn" onClick={addRest}>
              + Rest
            </button>
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
