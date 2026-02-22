import React from 'react';
import { EXERCISE_TYPES } from '../models/workout';
import './TemplateSelector.css';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const TemplateSelector = ({ templates, onSelectTemplate }) => {
  return (
    <div className="template-selector">
      <p className="template-subtitle">Choose your workout</p>
      <div className="template-list">
        {templates.map((template) => {
          const exerciseCount = template.exercises.filter(
            (e) => e.type !== EXERCISE_TYPES.REST
          ).length;

          return (
            <button
              key={template.id}
              className="template-card"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="template-card-header">
                <span className="template-name">{template.name}</span>
                <span className="template-duration">
                  {formatDuration(template.totalDuration)}
                </span>
              </div>
              <div className="template-card-meta">
                <span className="template-exercise-count">
                  {exerciseCount} exercises
                </span>
                <span className="template-type">AMRAP</span>
              </div>
              <div className="template-exercises-preview">
                {template.exercises.map((exercise, i) => (
                  <span key={i} className={`template-exercise-tag ${exercise.type === EXERCISE_TYPES.REST ? 'rest' : ''}`}>
                    {exercise.type === EXERCISE_TYPES.REST
                      ? `Rest ${exercise.duration}s`
                      : exercise.type === EXERCISE_TYPES.TIMED
                        ? `${exercise.name} ${exercise.duration}s`
                        : `${exercise.reps}× ${exercise.name}`}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
