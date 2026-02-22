import React, { useState } from 'react';
import Logo from './components/Logo';
import TemplateSelector from './components/TemplateSelector';
import AMRAPWorkoutView from './components/amrap/AMRAPWorkoutView';
import { WORKOUT_TEMPLATES } from './models/workout';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleSelectTemplate = (template) => {
    setSelectedWorkout(template);
    setView('active');
  };

  const handleStopWorkout = () => {
    setView('home');
    setSelectedWorkout(null);
  };

  if (view === 'active' && selectedWorkout) {
    return (
      <AMRAPWorkoutView
        config={selectedWorkout}
        onStop={handleStopWorkout}
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
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default App;
