'use client'

import HeroTitle from './HeroSection'
import { useMouseTilt } from '@/lib/useMouseTilt'

interface HeroCardProps {
  badge: string
  headingPrefix: string
  headingHighlight: string
  description: string
}

export default function HeroCard({
  badge,
  headingPrefix,
  headingHighlight,
  description
}: HeroCardProps) {
  const { ref, style } = useMouseTilt(4)

  return (
    <div className="relative w-full group/hero-card overflow-visible py-4 px-2">
      {/* Dynamic Layer 1 (Pink cardboard backing) */}
      <div 
        className="absolute inset-0 mx-2 my-4 bg-neo-pink border-2 border-[color:var(--neo-border)] rounded shadow-neo-sm transition-all duration-300 ease-out -z-10 transform translate-x-[4px] translate-y-[4px] group-hover/hero-card:translate-x-[-12px] group-hover/hero-card:translate-y-[8px] group-hover/hero-card:rotate-[-3.5deg] origin-center" 
        aria-hidden="true"
      />

      {/* Dynamic Layer 2 (Yellow cardboard backing) */}
      <div 
        className="absolute inset-0 mx-2 my-4 bg-neo-yellow border-2 border-[color:var(--neo-border)] rounded shadow-neo-sm transition-all duration-300 ease-out -z-20 transform translate-x-[8px] translate-y-[8px] group-hover/hero-card:translate-x-[14px] group-hover/hero-card:translate-y-[-8px] group-hover/hero-card:rotate-[3.5deg] origin-center" 
        aria-hidden="true"
      />

      {/* Main interactive top sheet */}
      <div 
        ref={ref}
        style={style}
        className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col bg-[color:var(--neo-surface)] border-2 border-[color:var(--neo-border)] transition-transform duration-200 select-none"
      >
        <HeroTitle 
          badge={badge}
          headingPrefix={headingPrefix}
          headingHighlight={headingHighlight}
          description={description}
        />

        <div className="flex flex-wrap gap-3 mt-8">
          <a href="#expertise" className="neo-btn neo-btn-pink min-h-[44px]" aria-label="Navigate to expertise section">
            Expertise
          </a>
          <a href="#projects" className="neo-btn neo-btn-blue min-h-[44px]" aria-label="Navigate to projects section">
            Projects
          </a>
          <a href="#experience" className="neo-btn neo-btn-lime min-h-[44px]" aria-label="Navigate to experience section">
            See Experience
          </a>
          <a href="#certifications" className="neo-btn neo-btn-yellow min-h-[44px]" aria-label="Navigate to certifications section">
            Certifications
          </a>
        </div>
      </div>
    </div>
  )
}
