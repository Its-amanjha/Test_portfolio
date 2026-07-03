# Hybrid Neobrutalist Design Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mix the high-impact Bebas Neue typography, floating animated stickers, and bouncy absolute social badges from `ridhafidz/portofolio-neobrutalism` into our current portfolio, keeping the flat straight laptop console on the right and the notebook page on the left.

**Architecture:** 
1. Load `Bebas_Neue` and `IBM_Plex_Mono` via Next.js Google Fonts in `app/layout.tsx`.
2. Add `@keyframes float-slow` and custom font classes in `app/globals.css`.
3. Add floating animated neobrutalist stickers and scattered floating social badges around the main hero grid in `app/page.tsx` and the card files.

**Tech Stack:** React, Next.js, Tailwind CSS (v4)

## Global Constraints
* Do not introduce any hydration mismatches.
* Absolute-positioned floating elements must be responsive (hidden or repositioned on mobile).

---

### Task 1: Load Fonts & Add CSS Float Keyframes

**Files:**
* Modify: `app/layout.tsx`
* Modify: `app/globals.css`

- [ ] **Step 1: Load Bebas_Neue and IBM_Plex_Mono in layout.tsx**
  
  Import the fonts in `app/layout.tsx` and apply their variables to the document HTML tag:
  ```typescript
  import { Inter, Bebas_Neue, IBM_Plex_Mono } from 'next/font/google'
  
  const bebasNeue = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-bebas-neue',
  })
  
  const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-ibm-plex-mono',
  })
  ```
  Inject them into the `html` variable list inside `RootLayout`:
  ```tsx
  <html lang="en" suppressHydrationWarning className={`${inter.variable} ${bebasNeue.variable} ${ibmPlexMono.variable}`}>
  ```

- [ ] **Step 2: Define float keyframes in globals.css**

  Add the following classes to `app/globals.css`:
  ```css
  @keyframes float-slow-1 {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50% { transform: translateY(-8px) rotate(-1deg); }
  }
  @keyframes float-slow-2 {
    0%, 100% { transform: translateY(0px) rotate(4deg); }
    50% { transform: translateY(-6px) rotate(6deg); }
  }
  @keyframes float-slow-3 {
    0%, 100% { transform: translateY(0px) rotate(-6deg); }
    50% { transform: translateY(-10px) rotate(-4deg); }
  }

  .animate-float-1 { animation: float-slow-1 6s ease-in-out infinite; }
  .animate-float-2 { animation: float-slow-2 5s ease-in-out infinite; }
  .animate-float-3 { animation: float-slow-3 7s ease-in-out infinite; }
  
  .font-bebas { font-family: var(--font-bebas-neue), sans-serif; }
  .font-ibm { font-family: var(--font-ibm-plex-mono), monospace; }
  ```

- [ ] **Step 3: Commit changes**

  ```bash
  git add app/layout.tsx app/globals.css
  git commit -m "style: load Bebas Neue & IBM Plex Mono fonts and add float CSS keyframes"
  ```

---

### Task 2: Refine Hero Section Heading & Add Floating Stickers

**Files:**
* Modify: `components/HeroSection.tsx`
* Modify: `app/page.tsx`

- [ ] **Step 1: Apply Bebas Neue to HeroCard title**
  
  Modify `components/HeroSection.tsx` to style the name and heading highlight using the bold `font-bebas` styling:
  ```tsx
  <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-4 leading-[0.95] text-[color:var(--neo-ink)]">
    {headingPrefix}{' '}
    <span className="bg-neo-yellow px-4 py-1 border-4 border-black shadow-[6px_6px_0_#000] inline-block -rotate-1 text-black">
      {headingHighlight}
    </span>
  </h1>
  ```

- [ ] **Step 2: Add floating neobrutalist stickers around the Hero grid**

  In `app/page.tsx`, wrap the `HeroCard` and `ContactCard` in a container featuring scattered floating sticker badges:
  * Top-Left Sticker: `💻 Open to Work` (rotated -4deg, pink background, floating)
  * Center-Bottom Sticker: `⚡ Fast & Clean` (rotated 3deg, lime background, floating)
  * Right Sticker: `🎨 AI & ML` (rotated -5deg, cyan background, floating)

- [ ] **Step 3: Verify the build**

  Run: `npm run build`
  Expected: Success.

- [ ] **Step 4: Commit changes**

  ```bash
  git add components/HeroSection.tsx app/page.tsx
  git commit -m "style: apply Bebas Neue font to Hero heading and add floating neobrutalist sticker badges"
  ```
