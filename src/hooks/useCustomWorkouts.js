import { useState, useEffect } from 'react';

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

  useEffect(() => {
    saveWorkouts(customWorkouts);
  }, [customWorkouts]);

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: `custom-${Date.now()}`,
    };
    setCustomWorkouts((prev) => [newWorkout, ...prev]);
    return newWorkout;
  };

  const deleteWorkout = (id) => {
    setCustomWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return { customWorkouts, addWorkout, deleteWorkout };
};
