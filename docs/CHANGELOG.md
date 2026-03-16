# Changelog

All notable changes to INTERVALO are documented here.

---

## [Unreleased]

## [0.2.0] - 2026-03-16

### Fixed

- **audioManager.js** — Fixed AudioContext leak. A new `AudioContext` was previously created on every beep call, causing resource accumulation over long workouts. The module now reuses a single shared instance.
- **useAMRAPTimer.js** — Removed duplicated inline duration calculation inside `advanceExercise`. The existing `getExerciseDuration` helper is now called instead.
- **AMRAPWorkoutView.jsx** — Removed duplicate `handleComplete` function (was identical to `handleStop`). Added `useMemo` for the `nonRestExercises` filter to avoid re-running the filter on every 100ms timer tick.
- **WorkoutBuilder.jsx** — Extracted repeated inline SVG chevron icons into `ChevronUp` and `ChevronDown` components. Removed `useMemo` wrapping trivial arithmetic (no performance benefit, added noise).
- **useCustomWorkouts.js** — Removed a `useEffect` that wrote to `localStorage` on mount. Persistence now happens only inside `addWorkout` and `deleteWorkout`, which is the correct place for explicit mutations.
- **AMRAPWorkoutView.jsx** — Removed unused `totalDuration` variable from hook destructuring.
- **audioManager.js** — Added `.catch()` handler for unresolved `AudioContext.resume()` promise to prevent silent audio failures under autoplay restrictions.
- **useAMRAPTimer.js** — Fixed prep beep tick-jitter bug: replaced window-based check (`<= 3000 && > 2900`) with threshold-crossing check (`prev > 3000 && newTime <= 3000`) so the beep fires reliably even if a tick is delayed.

### Security (no action taken — tracked for follow-up)

- Rollup build dependency has a path traversal CVE. Resolve with `npm audit fix`.
- `localStorage` data is parsed without schema validation. Consider adding a validation layer before trusting stored workout configs.
- No `Content-Security-Policy` meta tag in `index.html`.
- `.claude/settings.local.json` is committed and contains local paths — consider adding it to `.gitignore`.

### Planning (not implemented)

- Created a detailed plan for a future iOS App Store release via Capacitor with Apple HealthKit heart rate integration. Phase 5 (live HR during workout) was deferred due to Swift plugin complexity. Plan file: `.claude/plans/starry-scribbling-crescent.md`.

---

## [0.1.0] - 2026-03-15

### Added

- Initial release. React + Vite interval workout timer with flip-clock countdown, Web Audio API beeps, canvas-confetti completion screen, and localStorage-persisted custom workouts.
- Four built-in workout templates: Bodyweight Burner, Kettlebell Power, Quick HIIT, Full Body Grind.
- Workout builder for custom round-based intervals.
- Rebranded from AMRAP to INTERVALO.
