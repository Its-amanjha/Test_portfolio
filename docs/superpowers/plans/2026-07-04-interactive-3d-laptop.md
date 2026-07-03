# Interactive 3D Laptop & Contrast Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the dark mode text visibility/contrast bugs on the Hero Card and redesign the Contact Card into a left-facing, animated 3D neobrutalist laptop mockup with a theme-matching terminal display screen.

**Architecture:** Wrap the ContactCard component inside a 3D perspective wrapper (`perspective-[1200px]`, `preserve-3d`) and apply an initial isometric Y/X rotation. On hover, apply a swivel transition to rotate the laptop to face the viewer. Bind the screen background to `var(--neo-surface)` and text to `var(--neo-ink)` to maintain correct contrast and theme alignment.

**Tech Stack:** React, Next.js, Tailwind CSS (v4), React Icons

## Global Constraints
* Maintain 100% theme variable compliance (`var(--neo-surface)`, `var(--neo-border)`, `var(--neo-ink)`).
* Do not introduce any hydration mismatches.
* High visual contrast (WCAG AA compliant) in both light and dark modes.

---

### Task 1: Fix HeroCard Contrast and Theme Styling

**Files:**
* Modify: `components/HeroCard.tsx`

- [ ] **Step 1: Update HeroCard layout to use theme variables**
  
  Modify `components/HeroCard.tsx` around line 36. Replace hardcoded `bg-white dark:bg-zinc-900` with theme-aligned variables:
  ```tsx
  className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col bg-[color:var(--neo-surface)] border-2 border-black transition-transform duration-200 select-none overflow-hidden"
  ```

- [ ] **Step 2: Adjust ruled notebook lines to look clean in both themes**

  Update the inline `style` attribute on the notebook container in `components/HeroCard.tsx`:
  ```tsx
  style={{
    ...style,
    backgroundImage: 'linear-gradient(var(--neo-border) 1px, transparent 1px)',
    backgroundSize: '100% 28px',
    opacity: 0.05,
  }}
  ```
  Note: Set the opacity of the parent or background image container to `0.05` to keep the ruled lines extremely subtle.

- [ ] **Step 3: Commit changes**

  ```bash
  git add components/HeroCard.tsx
  git commit -m "style: fix HeroCard contrast and theme styling for dark mode"
  ```

---

### Task 2: Implement 3D Animated Laptop Mockup

**Files:**
* Modify: `components/ContactCard.tsx`

- [ ] **Step 1: Implement 3D perspective and hover swivel transition**

  Modify the return block in `components/ContactCard.tsx` to wrap the laptop in a perspective container:
  ```tsx
  return (
    <div 
      ref={ref}
      style={style}
      id="contact-card" 
      className="relative w-full overflow-visible py-8 flex flex-col items-center select-none group/laptop [perspective:1200px]"
    >
      {/* 1. Laptop Lid / Screen */}
      <div 
        className="relative w-[95%] sm:w-[90%] aspect-[16/11.5] bg-zinc-800 dark:bg-zinc-700 border-4 border-black rounded-t-2xl shadow-[6px_6px_0_#000] flex flex-col overflow-hidden z-10 transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateY(-18deg)_rotateX(10deg)_rotateZ(-2deg)_scale(0.96)] group-hover/laptop:[transform:rotateY(-4deg)_rotateX(2deg)_rotateZ(0deg)_scale(1.02)]"
      >
        ...
      </div>
      ...
    </div>
  )
  ```

- [ ] **Step 2: Bind screen background to website theme**

  Update the terminal screen component inside `components/ContactCard.tsx` to use the theme surface background instead of a hardcoded dark background:
  ```tsx
  className="bg-[color:var(--neo-surface)] text-[color:var(--neo-ink)] p-3 sm:p-4 rounded border-2 border-black flex flex-col flex-1 font-mono overflow-y-auto text-xs relative select-text max-h-[340px] sm:max-h-[380px] scrollbar-thin"
  ```

- [ ] **Step 3: Adjust terminal content text colors**

  Ensure that:
  * Title/prompt strings like `$ get --location` are styled with a soft slate color (e.g. `text-zinc-500 dark:text-zinc-400`).
  * Non-interactive labels are styled with high contrast (`text-[color:var(--neo-ink)]`).
  * Accents and clickable widgets use their designated brand classes (`bg-neo-cyan`, `bg-neo-pink`, etc.) with high-contrast text tags.

- [ ] **Step 4: Verify the build**

  Run: `npm run build`
  Expected: Successful compilation without TypeScript errors.

- [ ] **Step 5: Commit changes**

  ```bash
  git add components/ContactCard.tsx
  git commit -m "style: implement 3D swivel laptop mockup and theme-matching terminal display"
  ```
