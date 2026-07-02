'use client'

import { useRef, useState, useEffect } from 'react'

export function useMouseTilt(maxTilt = 6) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const w = rect.width
      const h = rect.height

      // Calculate relative tilt angles
      const rx = -((y / h) - 0.5) * maxTilt
      const ry = ((x / w) - 0.5) * maxTilt

      // Calculate neobrutalist shadow shifts (opposing direction for weight balance)
      const shadowDx = 8 - ((x / w) - 0.5) * 6
      const shadowDy = 8 - ((y / h) - 0.5) * 6

      setStyle({
        transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.01, 1.01, 1.01)`,
        boxShadow: `${shadowDx}px ${shadowDy}px 0px var(--neo-border, #000)`,
        transition: 'transform 0.05s ease, box-shadow 0.05s ease'
      })
    }

    const handleMouseLeave = () => {
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: '8px 8px 0px var(--neo-border, #000)',
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt])

  return { ref, style }
}
