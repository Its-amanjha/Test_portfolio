# Design Spec: Interactive 3D Laptop & Contrast Redesign

Design and layout specifications for the interactive 3D left-facing laptop contact card and dark mode contrast fixes for the hero section.

## Goals
* Fix the dark mode text visibility/contrast bugs on the Hero Card.
* Redesign the Contact Card into a left-facing, animated 3D neobrutalist laptop mockup.
* Implement Option 1 (Swivel & Face) animation on hover.

## Proposed Changes

### 1. Contrast & Color Correction (Hero Card & Contact Card)
* **Problem**: Hardcoded backgrounds (`bg-white dark:bg-zinc-900`) combined with theme text tokens cause poor contrast (dark charcoal text on dark grey backgrounds) in dark mode.
* **Solution**: Bind card backgrounds, borders, and text to matching Tailwind theme variables (`bg-[color:var(--neo-surface)]`, `border-[color:var(--neo-border)]`, and `text-[color:var(--neo-ink)]`).
* **Notebook Lines**: Adjust the ruled notebook lines in `HeroCard.tsx` to use a soft opacity border that is subtle in both light and dark modes:
  * Light Mode: `rgba(0, 0, 0, 0.04)`
  * Dark Mode: `rgba(255, 255, 255, 0.05)`

### 2. 3D Left-Facing Laptop Mockup
* **Perspective Wrapper**: Wrap the entire laptop component in `perspective-[1200px]` and `preserve-3d` containers.
* **Initial 3D Transform**: Apply a left-facing tilt using CSS transforms:
  ```css
  transform: perspective(1000px) rotateY(-18deg) rotateX(10deg) rotateZ(-2deg) scale(0.96);
  ```
* **Hover Interaction (Swivel & Face)**: On hover of the parent group, smoothly swivel the laptop to face the user:
  ```css
  transform: perspective(1000px) rotateY(-4deg) rotateX(2deg) rotateZ(0deg) scale(1.02);
  ```
  Transition using a premium spring-like easing: `transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1)`.

### 3. Display Content (Terminal Screen)
* Render the contact details as clean shell outputs on a black display panel with code syntax colors matching the brand identity (Lime, Cyan, Pink).
* Keep all interactive elements (Mail link, Floppy-disk social links, CV download, Weather screen) fully operational inside the terminal viewport.

## Verification Plan
* Run local build verification: `npm run build`
* Verify text readability in both Light and Dark mode.
* Manually inspect 3D hover swiveling animations.
