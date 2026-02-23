import React from 'react';
import { EXERCISE_TYPES } from '../models/workout';
import './TemplateSelector.css';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const isRoundBased = (exercises) => {
  const rounds = exercises.filter((e) => e.type !== EXERCISE_TYPES.REST);
  return rounds.length > 0 && rounds.every((e) => /^Round \d+$/.test(e.name));
};

const formatRoundSummary = (exercises) => {
  const rounds = exercises.filter((e) => e.type !== EXERCISE_TYPES.REST);
  const rests = exercises.filter((e) => e.type === EXERCISE_TYPES.REST);
  const roundDur = rounds[0]?.duration || 0;
  const restDur = rests[0]?.duration || 0;
  const roundLabel = roundDur >= 60
    ? `${Math.floor(roundDur / 60)}m${roundDur % 60 ? ` ${roundDur % 60}s` : ''}`
    : `${roundDur}s`;
  let summary = `${rounds.length} rounds × ${roundLabel}`;
  if (restDur > 0) summary += ` · ${restDur}s rest`;
  return summary;
};

const WorkoutCard = ({ template, onSelect, onDelete }) => {
  const exerciseCount = template.exercises.filter(
    (e) => e.type !== EXERCISE_TYPES.REST
  ).length;
  const roundBased = isRoundBased(template.exercises);

  return (
    <button
      className="template-card"
      onClick={() => onSelect(template)}
    >
      {onDelete && (
        <span
          className="template-card-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(template.id);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      )}
      <div className="template-card-header">
        <span className="template-name">{template.name}</span>
        <span className="template-duration">
          {formatDuration(template.totalDuration)}
        </span>
      </div>
      <div className="template-card-meta">
        <span className="template-exercise-count">
          {roundBased ? formatRoundSummary(template.exercises) : `${exerciseCount} exercises`}
        </span>
        <span className="template-type">INTERVALO</span>
      </div>
      {!roundBased && (
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
      )}
    </button>
  );
};

const TemplateSelector = ({
  templates,
  customWorkouts = [],
  onSelectTemplate,
  onCreateWorkout,
  onDeleteWorkout,
}) => {
  return (
    <div className="template-selector">
      <button className="create-workout-btn" onClick={onCreateWorkout}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Create Workout
      </button>

      {customWorkouts.length > 0 && (
        <>
          <p className="template-subtitle">My Workouts</p>
          <div className="template-list">
            {customWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                template={workout}
                onSelect={onSelectTemplate}
                onDelete={onDeleteWorkout}
              />
            ))}
          </div>
        </>
      )}

      <p className="template-subtitle">Templates</p>
      <div className="template-list">
        {templates.map((template) => (
          <WorkoutCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
