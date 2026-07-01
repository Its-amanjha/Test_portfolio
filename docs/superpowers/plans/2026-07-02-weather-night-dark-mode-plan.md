# Weather Widget Night & Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the home page weather widget to prune seconds from the clock, display a rocking crescent moon at night instead of the sun, and optimize all widget styling/borders for dark mode compatibility.

**Architecture:** Use client-side time-check ranges (`hour >= 18 || hour < 6`) to calculate night conditions, render custom hand-crafted neobrutalist SVGs directly in React, and add stylesheet overrides for the `html.dark-mode` class.

**Tech Stack:** Next.js, React, Tailwind CSS, Open-Meteo API.

## Global Constraints
* No custom external layout libraries (only standard CSS and React).
* All SVG strokes must follow Neobrutalist design specifications.
* Do not introduce any hydration mismatches.

---

### Task 1: Update Clock Logic to Remove Seconds

**Files:**
* Modify: `components/DateTimeWeather.tsx`

**Interfaces:**
* Consumes: Current `components/DateTimeWeather.tsx` code.
* Produces: Clean clock updating every 60 seconds showing only `HH:MM AM/PM`.

- [ ] **Step 1: Modify DateTimeFormatter settings**
  Update the `Intl.DateTimeFormat` configurations to exclude `second`:
  ```typescript
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  ```

- [ ] **Step 2: Adjust setInterval rate**
  Change the interval trigger from `1000ms` to `60000ms` to update once a minute.
  ```typescript
  const timer = setInterval(updateTime, 60000)
  ```

- [ ] **Step 3: Run dev compilation**
  Run: `npm run build`
  Expected: Compiled successfully.

- [ ] **Step 4: Commit changes**
  ```bash
  git add components/DateTimeWeather.tsx
  git commit -m "chore: remove seconds from Delhi clock and reduce update frequency"
  ```

---

### Task 2: Implement Night-Shift Weather SVGs

**Files:**
* Modify: `components/DateTimeWeather.tsx`

**Interfaces:**
* Consumes: Task 1 outputs.
* Produces: Responsive custom SVG weather icons representing day/night shifts.

- [ ] **Step 1: Create Night Shift hour detection**
  Add a helper variable inside `DateTimeWeather` to check if it's night-time in Delhi:
  ```typescript
  const delhiHour = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getHours()
  const isNight = delhiHour >= 18 || delhiHour < 6
  ```

- [ ] **Step 2: Upgraded getWeatherIcon logic with Moon SVGs**
  If `isNight` is true:
  * For code `0` (Sunny/Clear), render a Crescent Moon:
    ```xml
    <svg className="w-8 h-8 overflow-visible" viewBox="0 0 32 32">
      <path 
        d="M22 23 C14.5 23 8.5 17 8.5 9.5 C8.5 7.5 9 5.5 10 4 C5.5 6 3.5 11 3.5 16 C3.5 22.5 8.5 27.5 15 27.5 C20.5 27.5 25 23.5 26.5 18 C25 21.5 21.5 23 18.5 23 Z" 
        fill="#FFE600" 
        stroke="black" 
        strokeWidth="2.2" 
        className="moon-cradle-rock"
        style={{ transformOrigin: 'center' }}
      />
    </svg>
    ```
  * For codes `1, 2, 3` (Partly Cloudy), render a Crescent Moon peeking out from behind a cloud:
    ```xml
    <svg className="w-8 h-8 overflow-visible" viewBox="0 0 32 32">
      <path 
        d="M21 9 C17.5 9 14.5 6.5 14.5 3 C14.5 2 15 1 15.5 0.5 C12 1.5 10 4.5 10 8 C10 12.5 13.5 16 18 16 C22 16 25 13 26 9.5 C25 11 23 11 21 9 Z" 
        fill="#FFE600" 
        stroke="black" 
        strokeWidth="1.8" 
        className="moon-cradle-rock"
        style={{ transformOrigin: '21px 9px' }}
      />
      <path 
        d="M6 20 C6 16.5, 9.5 13.5, 13 14 C14.5 11, 19.5 11, 21.5 14 C24.5 14, 26 16.5, 26 20 C26 22, 24 24, 21 24 H11 C8 24, 6 22, 6 20 Z" 
        fill="#A5F3FC" 
        stroke="black" 
        strokeWidth="2.2"
        className="cloud-float-slow"
        style={{ transformOrigin: 'center' }}
      />
    </svg>
    ```

- [ ] **Step 3: Define Moon rocking keyframe animations**
  Add `@keyframes moon-rock` to the inline style tags:
  ```css
  @keyframes moon-rock {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(10deg); }
  }
  .moon-cradle-rock {
    animation: moon-rock 6s ease-in-out infinite;
  }
  ```

- [ ] **Step 4: Verify build**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add components/DateTimeWeather.tsx
  git commit -m "feat: add night-shift crescent moon SVGs and rocking animations"
  ```

---

### Task 3: Add Light & Dark Mode CSS Theme Overrides

**Files:**
* Modify: `components/DateTimeWeather.tsx`

**Interfaces:**
* Consumes: Task 2 outputs.
* Produces: Dark-mode fully optimized colors for weather card background and SVG strokes.

- [ ] **Step 1: Replace hardcoded styling classes on container card**
  Change class `bg-neo-pink` on the root widget container `div` to custom `weather-widget` class, and change `border-black` to `border-[color:var(--neo-border)]`.
  ```typescript
  className="neo-card p-4 weather-widget border-2 border-[color:var(--neo-border)] shadow-neo-sm hover:scale-[1.02] transition-transform duration-150 cursor-default select-none relative overflow-hidden"
  ```

- [ ] **Step 2: Add theme-varying color classes in `<style>` block**
  Define `.weather-widget` behavior in the inline styles:
  ```css
  .weather-widget {
    background-color: var(--neo-pink);
    color: #000;
  }
  .weather-widget .divider {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 0, 0, 0.4);
  }
  
  /* Dark Mode Class Overrides */
  html.dark-mode .weather-widget {
    background-color: #1e1b29;
    color: var(--neo-ink);
  }
  html.dark-mode .weather-widget .divider {
    background-color: var(--neo-border);
    opacity: 0.35;
  }
  ```

- [ ] **Step 3: Make SVG strokes dynamic**
  Replace all `stroke="black"` attributes inside the custom SVGs with `className="weather-stroke"`, and define it in the styles:
  ```css
  .weather-stroke {
    stroke: #000;
  }
  html.dark-mode .weather-stroke {
    stroke: var(--neo-border);
  }
  ```

- [ ] **Step 4: Verify build**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add components/DateTimeWeather.tsx
  git commit -m "style: optimize weather widget card background and SVG strokes for dark mode"
  ```
