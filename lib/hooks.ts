'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Debounce a fast-changing value. Useful for search inputs so we don't
 * recompute/filter on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/**
 * Returns a throttled version of a callback (leading + trailing).
 * Handy for scroll / resize / pointer handlers.
 */
export function useThrottledCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 100
) {
  const last = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  return (...args: A) => {
    const now = Date.now()
    const remaining = wait - (now - last.current)
    if (remaining <= 0) {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
      last.current = now
      fnRef.current(...args)
    } else if (!timer.current) {
      timer.current = setTimeout(() => {
        last.current = Date.now()
        timer.current = null
        fnRef.current(...args)
      }, remaining)
    }
  }
}

/**
 * Single shared dark-mode observer.
 * Previously every component spun up its own MutationObserver; this avoids
 * that duplication. Only components that truly need JS-level theme info
 * (e.g. <canvas> drawing) should use it — styled components theme via CSS vars.
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains('dark-mode'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => obs.disconnect()
  }, [])
  return isDark
}
