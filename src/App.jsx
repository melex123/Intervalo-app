import React, { useState } from 'react';
import Logo from './components/Logo';
import TemplateSelector from './components/TemplateSelector';
import WorkoutBuilder from './components/WorkoutBuilder';
import AMRAPWorkoutView from './components/amrap/AMRAPWorkoutView';
import { useCustomWorkouts } from './hooks/useCustomWorkouts';
import { WORKOUT_TEMPLATES } from './models/workout';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { customWorkouts, addWorkout, deleteWorkout } = useCustomWorkouts();

  const handleSelectTemplate = (template) => {
    setSelectedWorkout(template);
    setView('active');
  };

  const handleStopWorkout = () => {
    setView('home');
    setSelectedWorkout(null);
  };

  const handleSaveWorkout = (config) => {
    addWorkout(config);
    setView('home');
  };

  const handleSaveAndStart = (config) => {
    const saved = addWorkout(config);
    setSelectedWorkout(saved);
    setView('active');
  };

  if (view === 'active' && selectedWorkout) {
    return (
      <AMRAPWorkoutView
        config={selectedWorkout}
        onStop={handleStopWorkout}
      />
    );
  }

  if (view === 'builder') {
    return (
      <WorkoutBuilder
        onSave={handleSaveWorkout}
        onSaveAndStart={handleSaveAndStart}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <Logo />
      </div>
      <TemplateSelector
        templates={WORKOUT_TEMPLATES}
        customWorkouts={customWorkouts}
        onSelectTemplate={handleSelectTemplate}
        onCreateWorkout={() => setView('builder')}
        onDeleteWorkout={deleteWorkout}
      />
    </div>
  );
}

export default App;
