# INTERVALO - Interval Workout Timer

## Overview

INTERVALO is a mobile-first interval workout timer built with React + Vite. Users select a workout template (or create their own) and the app guides them through timed rounds and rest periods with audio cues, a flip-clock countdown, and a confetti celebration on completion.

The app runs entirely client-side with no backend. Custom workouts are persisted in `localStorage`.

## Tech Stack

- **React 19** (functional components, hooks)
- **Vite 7** (dev server, build)
- **canvas-confetti** (workout completion animation)
- **Web Audio API** (countdown beeps)
- **CSS** (no framework, CSS custom properties for theming)

## Project Structure

```
src/
  App.jsx                 # Root component, view routing (home / builder / active)
  App.css                 # Global CSS variables and base styles
  main.jsx                # React entry point
  index.css               # Reset styles

  components/
    Logo.jsx              # SVG logo + "INTERVALO" text
    TemplateSelector.jsx  # Home screen - workout template grid
    TemplateSelector.css
    WorkoutBuilder.jsx    # Create custom round-based workouts
    WorkoutBuilder.css

    amrap/                # Workout execution components
      AMRAPWorkoutView.jsx    # Main workout screen (orchestrator)
      AMRAPWorkoutView.css
      AMRAPHeader.jsx         # "INTERVALO" title + stop button
      AMRAPHeader.css
      AMRAPProgressBar.jsx    # Top progress bar
      AMRAPProgressBar.css
      AMRAPExerciseIndicators.jsx  # Exercise count + rounds counter
      AMRAPExerciseIndicators.css
      AMRAPExerciseList.jsx   # Scrollable exercise list (previous/active/next)
      AMRAPExerciseList.css
      AMRAPExerciseCard.jsx   # Individual exercise card (3 variants)
      AMRAPExerciseCard.css
      FlipClockTimer.jsx      # Animated flip-clock countdown display
      FlipClockTimer.css
      RepStepper.jsx          # +/- buttons for rep adjustment
      RepStepper.css
      AMRAPWorkoutComplete.jsx  # Completion modal with stats + confetti
      AMRAPWorkoutComplete.css

  hooks/
    useAMRAPTimer.js      # Core timer logic (phases, countdown, exercise progression)
    useCustomWorkouts.js  # localStorage CRUD for custom workouts

  models/
    workout.js            # Exercise types enum + 4 built-in workout templates

  utils/
    audioManager.js       # Web Audio API beep sounds (prep + final)
    confetti.js           # canvas-confetti wrapper
```

## Key Concepts

### Exercise Types (`src/models/workout.js`)

```
TIMED  - Time-based exercise (e.g. 30s plank). Auto-advances when timer reaches 0.
REPS   - Rep-based exercise (e.g. 10 push-ups). User taps "Done" to advance.
REST   - Rest period with countdown. Auto-advances when timer reaches 0.
```

### Timer Phases (`src/hooks/useAMRAPTimer.js`)

```
IDLE     -> User hasn't started yet
PREP     -> 5-second "GET READY" countdown
ACTIVE   -> Workout is running
PAUSED   -> User paused the workout
COMPLETE -> Global timer reached 0
```

The timer ticks every 100ms. It tracks both a **global countdown** (total workout time) and an **exercise countdown** (current exercise/rest time). When the exercise timer hits 0 for TIMED/REST exercises, it auto-advances to the next exercise. When all exercises in a round are done, `completedRounds` increments and the cycle restarts.

### Exercise Card Variants (`src/components/amrap/AMRAPExerciseCard.jsx`)

The `AMRAPExerciseCard` renders in three variants based on the `variant` prop:

- **`previous`** - Completed exercise. Shows check mark or rep count. Reps can be adjusted retroactively via `RepStepper`.
- **`active`** - Currently running exercise. Bright yellow background for exercises, **red background for rest**. Shows countdown timer and pause/done controls.
- **`next`** - Upcoming exercise. Muted styling with duration/rep preview.

### Workout Builder (`src/components/WorkoutBuilder.jsx`)

Creates round-based interval workouts with configurable:
- Workout name
- Number of rounds (1-50)
- Round duration (min 10s, up to 10min)
- Rest between rounds (preset: 0, 15, 30, 45, 60, 90s)

Generates a workout config with alternating `TIMED` rounds and `REST` periods. Saved to `localStorage` via `useCustomWorkouts` hook.

### Audio (`src/utils/audioManager.js`)

Uses Web Audio API to generate beep sounds:
- **Prep beep** (600Hz, 100ms) - plays at 3 seconds remaining
- **Final beep** (1000Hz, 150ms) - plays on exercise transitions

## Theming (`src/App.css`)

All colors are defined as CSS custom properties in `:root`:

| Variable | Value | Usage |
|---|---|---|
| `--color-bg` | `#0b1022` | Page background |
| `--color-surface` | `#111827` | Card backgrounds |
| `--color-accent` | `#c5e500` | Active exercise highlight, logo, buttons |
| `--color-rest-bg` | `#6b2020` | Rest period card background (red) |
| `--color-text` | `#ffffff` | Primary text |
| `--color-text-muted` | `#8892a8` | Secondary text |
| `--color-border` | `#2d3645` | Card borders |

## Views / Navigation

The app has 3 views managed by `useState` in `App.jsx`:

1. **`home`** - Logo + template selector grid. Shows built-in templates and custom workouts.
2. **`builder`** - Workout creation form. Save only, or save + immediately start.
3. **`active`** - Full-screen workout execution. Shows timer, exercise list, progress bar.

## Data Flow

```
App.jsx
  |-- view state ('home' | 'builder' | 'active')
  |-- selectedWorkout state (workout config object)
  |-- useCustomWorkouts() -> { customWorkouts, addWorkout, deleteWorkout }
  |
  |-- [home] -> TemplateSelector
  |     |-- WORKOUT_TEMPLATES (built-in, from models/workout.js)
  |     |-- customWorkouts (from localStorage)
  |     |-- onSelect -> sets selectedWorkout, switches to 'active'
  |
  |-- [builder] -> WorkoutBuilder
  |     |-- builds workout config from user input
  |     |-- onSave -> addWorkout + go home
  |     |-- onSaveAndStart -> addWorkout + set selectedWorkout + go active
  |
  |-- [active] -> AMRAPWorkoutView
        |-- receives config (selectedWorkout)
        |-- useAMRAPTimer(config) -> all timer state + controls
        |-- renders: ProgressBar, Header, FlipClock, Indicators, ExerciseList, Complete
```

## Built-in Templates (`src/models/workout.js`)

| Name | Duration | Exercises |
|---|---|---|
| Bodyweight Burner | 12 min | Jumping Jacks, Push-ups, Air Squats + 30s rest |
| Kettlebell Power | 16 min | KB Swing, Goblet Squat, KB Deadlift, Plank Hold + 30s rest |
| Quick HIIT | 8 min | Burpees, Mountain Climbers, Box Jumps + 20s rest |
| Full Body Grind | 20 min | Pull-ups, DB Thrusters, Lunges, Plank Hold + 45s rest |

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Deployment

The app is deployed on Netlify at `intervalotime.netlify.app`. Any push to `main` triggers a new deploy via Vite's `npm run build`.
