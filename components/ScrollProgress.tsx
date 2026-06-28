'use client'
import { memo, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Homepage section id -> bar colour.
const SECTION_COLORS: Record<string, string> = {
  hero: 'var(--neo-pink)',
  projects: 'var(--neo-blue)',
  experience: 'var(--neo-lime)',
  blogs: 'var(--neo-yellow)',
}
const SECTION_IDS = Object.keys(SECTION_COLORS)

// Fixed colour for non-home routes (project details + admin sub-pages).
// Ordered most-specific first.
const ROUTE_COLORS: [string, string][] = [
  ['/console/projects', 'var(--neo-blue)'],
  ['/console/experience', 'var(--neo-lime)'],
  ['/console/blogs', 'var(--neo-yellow)'],
  ['/console', 'var(--neo-purple)'],
  ['/projects/', 'var(--neo-blue)'],
]

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const setColor = (c: string) => {
      if (barRef.current) barRef.current.style.background = c
    }

    const routeMatch = ROUTE_COLORS.find(([p]) => pathname === p || pathname.startsWith(p))
    const isHome = pathname === '/'

    let rafId = 0
    let lastProgress = -1

    const update = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const doc = document.documentElement
        const height = doc.scrollHeight - window.innerHeight
        const scrolled = window.scrollY
        const progress = height > 0 ? (scrolled / height) * 100 : 0
        if (Math.abs(progress - lastProgress) > 0.1) {
          lastProgress = progress
          if (barRef.current) barRef.current.style.width = `${progress}%`
        }

        // On the homepage, resolve the active section live (robust to the
        // sections rendering AFTER this effect first runs).
        if (isHome) {
          const mid = scrolled + window.innerHeight * 0.4
          for (const id of SECTION_IDS) {
            const el = document.getElementById(id)
            if (!el) continue
            const top = el.offsetTop
            if (mid >= top && mid < top + el.offsetHeight) {
              setColor(SECTION_COLORS[id])
              break
            }
          }
        }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    if (routeMatch && !isHome) {
      // Detail / admin pages: fixed section colour.
      setColor(routeMatch[1])
    } else {
      setColor('var(--neo-pink)')
    }

    // Run now + retry a few times so the colour resolves once the homepage
    // sections mount (covers the loading.tsx -> page commit gap).
    update()
    const timers = [60, 160, 320, 600].map((t) => window.setTimeout(update, t))

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (rafId) cancelAnimationFrame(rafId)
      timers.forEach(clearTimeout)
    }
  }, [pathname])

  return (
    <div
      className="fixed top-0 left-0 z-50 w-0"
      style={{
        height: '6px',
        background: 'var(--neo-pink)',
        borderBottom: '2px solid var(--neo-border)',
        borderRight: '2px solid var(--neo-border)',
        willChange: 'width, background',
        transition: 'background 250ms ease',
        contain: 'layout style paint',
        transform: 'translateZ(0)',
      }}
      ref={barRef}
      aria-hidden="true"
    />
  )
}

export default memo(ScrollProgress)
