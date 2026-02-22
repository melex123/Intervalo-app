export const EXERCISE_TYPES = {
  TIMED: 'TIMED',
  REPS: 'REPS',
  REST: 'REST',
};

let nextId = 1;
const id = () => String(nextId++);

export const WORKOUT_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Bodyweight Burner',
    totalDuration: 12 * 60,
    exercises: [
      { id: id(), name: 'Jumping Jacks', type: EXERCISE_TYPES.REPS, reps: 10 },
      { id: id(), name: 'Push-ups', type: EXERCISE_TYPES.REPS, reps: 8 },
      { id: id(), name: 'Air Squats', type: EXERCISE_TYPES.REPS, reps: 12 },
      { id: id(), name: 'Rest', type: EXERCISE_TYPES.REST, duration: 30 },
    ],
  },
  {
    id: 'template-2',
    name: 'Kettlebell Power',
    totalDuration: 16 * 60,
    exercises: [
      { id: id(), name: 'Kettlebell Swing', type: EXERCISE_TYPES.REPS, reps: 15 },
      { id: id(), name: 'Goblet Squat', type: EXERCISE_TYPES.REPS, reps: 10 },
      { id: id(), name: 'Kettlebell Deadlift', type: EXERCISE_TYPES.REPS, reps: 6 },
      { id: id(), name: 'Plank Hold', type: EXERCISE_TYPES.TIMED, duration: 30 },
      { id: id(), name: 'Rest', type: EXERCISE_TYPES.REST, duration: 30 },
    ],
  },
  {
    id: 'template-3',
    name: 'Quick HIIT',
    totalDuration: 8 * 60,
    exercises: [
      { id: id(), name: 'Burpees', type: EXERCISE_TYPES.REPS, reps: 5 },
      { id: id(), name: 'Mountain Climbers', type: EXERCISE_TYPES.TIMED, duration: 20 },
      { id: id(), name: 'Box Jumps', type: EXERCISE_TYPES.REPS, reps: 10 },
      { id: id(), name: 'Rest', type: EXERCISE_TYPES.REST, duration: 20 },
    ],
  },
  {
    id: 'template-4',
    name: 'Full Body Grind',
    totalDuration: 20 * 60,
    exercises: [
      { id: id(), name: 'Pull-ups', type: EXERCISE_TYPES.REPS, reps: 5 },
      { id: id(), name: 'Dumbbell Thrusters', type: EXERCISE_TYPES.REPS, reps: 10 },
      { id: id(), name: 'Lunges', type: EXERCISE_TYPES.REPS, reps: 12 },
      { id: id(), name: 'Plank Hold', type: EXERCISE_TYPES.TIMED, duration: 45 },
      { id: id(), name: 'Rest', type: EXERCISE_TYPES.REST, duration: 45 },
    ],
  },
];
