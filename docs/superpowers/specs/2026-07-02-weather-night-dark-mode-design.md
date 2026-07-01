# Design Spec: Delhi Night & Dark Mode Weather Widget

## Context & Purpose
The portfolio weather widget dynamically showcases the live time and weather of Delhi, India (Aman's location) under the CV download button. 
However, it currently displays a bright yellow sun at night, ticks second-by-second (unnecessary load and motion), and has fixed light-mode pink backgrounds/black borders that clash with dark mode.

This spec details:
1. Pruning seconds from the clock to prevent constant layouts updates.
2. Introducing a **Night Shift** detector (6 PM – 6 AM Delhi Time) to render neobrutalist crescent moons instead of suns.
3. Optimizing the colors, borders, and SVG strokes for both **Light Mode** and **Dark Mode** (`html.dark-mode`).

---

## Proposed Changes

### 1. Clock Updates
* Drop seconds formatting from clock rendering.
* Set state update interval to `60000ms` (1 minute) instead of `1000ms`.

### 2. Night Shift Mapping
* Define a night-range function: `isNight = hour >= 18 || hour < 6`.
* If `isNight === true`:
  * **Sunny / Clear (code 0)**: Displays a custom Neobrutalist **Crescent Moon** with a gentle rocking rotation.
  * **Partly Cloudy (codes 1, 2, 3)**: Displays the Crescent Moon peeking from behind a cloud.
  * **Rainy / Stormy / Snowy**: Darken the cloud fills to slate gray/deep purple.

### 3. Light & Dark Mode CSS Classes
Introduce dynamic CSS styles inside the component wrapper:
* **Background Card**: Shifts from bright Neobrutalist pink (`var(--neo-pink)`) in light mode to deep purple-slate (`#1e1b29`) with matching border colors (`var(--neo-border)`) in dark mode.
* **SVG Strokes**: Replaced static `stroke="black"` with a dynamic class `.weather-stroke` that shifts to `var(--neo-border)` (white/cream) in dark mode.
* **SVG Fills**: Clouds and weather accents shift to deeper, contrast-optimized fills under dark mode.

---

## Verification Plan

### Automated Build Check
* Run `npm run build` to verify no Next.js static generation or SSR compilation issues.

### Manual Inspection
* Set system theme to Light & Dark to inspect visual styles.
* Simulate night-time hours in code to test Moon animations.
