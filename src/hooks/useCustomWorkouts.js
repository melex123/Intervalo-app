import { useState } from 'react';

const STORAGE_KEY = 'intervalo-custom-workouts';

const loadWorkouts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveWorkouts = (workouts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
};

export const useCustomWorkouts = () => {
  const [customWorkouts, setCustomWorkouts] = useState(loadWorkouts);

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: `custom-${Date.now()}`,
    };
    setCustomWorkouts((prev) => {
      const updated = [newWorkout, ...prev];
      saveWorkouts(updated);
      return updated;
    });
    return newWorkout;
  };

  const deleteWorkout = (id) => {
    setCustomWorkouts((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveWorkouts(updated);
      return updated;
    });
  };

  return { customWorkouts, addWorkout, deleteWorkout };
};
