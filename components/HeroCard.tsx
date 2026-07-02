'use client'

import { useState } from 'react'
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
  const [isClosed, setIsClosed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const { ref, style } = useMouseTilt(5)

  if (isClosed) {
    return (
      <div 
        className="neo-card w-full p-8 flex flex-col items-center justify-center text-center bg-[color:var(--neo-surface)] border-2 border-[color:var(--neo-border)] min-h-[350px] shadow-neo transition-all duration-300"
      >
        <span className="text-5xl mb-4 animate-bounce">👾</span>
        <h3 className="text-xl font-black mb-2 text-[color:var(--neo-ink)]">aman_jha_profile.exe terminated.</h3>
        <p className="text-sm text-[color:var(--neo-ink-soft)] font-medium mb-6">
          Process returned exit code 0. Tap launch to restart.
        </p>
        <button 
          onClick={() => setIsClosed(false)} 
          className="neo-btn neo-btn-pink py-2.5 px-6 uppercase tracking-wider font-extrabold text-sm"
        >
          Launch Profile
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      style={style}
      className="neo-card w-full flex flex-col overflow-hidden bg-[color:var(--neo-surface)] border-2 border-[color:var(--neo-border)]"
    >
      {/* Retro OS Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[color:var(--neo-surface)] border-b-2 border-[color:var(--neo-border)] select-none">
        {/* Left macOS style window controls */}
        <div className="flex items-center gap-2 group/controls">
          <button 
            onClick={() => setIsClosed(true)}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/40 flex items-center justify-center text-[8px] font-black text-black/60 hover:text-black"
            title="Close Window"
          >
            <span className="opacity-0 group-hover/controls:opacity-100 transition-opacity">×</span>
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/40 flex items-center justify-center text-[8px] font-black text-black/60 hover:text-black"
            title="Minimize Window"
          >
            <span className="opacity-0 group-hover/controls:opacity-100 transition-opacity">-</span>
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/40 flex items-center justify-center text-[8px] font-black text-black/60 hover:text-black"
            title="Maximize Window"
          >
            <span className="opacity-0 group-hover/controls:opacity-100 transition-opacity">+</span>
          </button>
        </div>

        {/* Center Grab-bar title */}
        <div className="flex-1 mx-4 h-5 flex items-center justify-center relative overflow-hidden bg-dot-pattern rounded border border-dashed border-[color:var(--neo-border)]/30 px-3">
          <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[color:var(--neo-ink-soft)] bg-[color:var(--neo-surface)] px-2 z-10">
            aman_jha_profile.exe
          </span>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border border-black/20" />
          <span className="text-[8px] font-black font-mono tracking-wider opacity-60">RUNNING</span>
        </div>
      </div>

      {/* Retro Window Content Panel */}
      <div 
        className={`relative z-10 p-6 sm:p-8 flex-1 flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-0 py-0 overflow-hidden opacity-0' : 'opacity-100'
        }`}
      >
        <HeroTitle 
          badge={badge}
          headingPrefix={headingPrefix}
          headingHighlight={headingHighlight}
          description={description}
        />

        {/* Maximized Easter Eggs Panel */}
        {isMaximized && (
          <div className="mb-6 p-4 bg-black text-[#00ff00] font-mono text-xs rounded border-2 border-neo-border shadow-neo-sm overflow-x-auto relative">
            <div className="absolute top-2 right-2 text-[8px] uppercase tracking-widest opacity-60 font-black animate-pulse">
              Debug Mode
            </div>
            <div className="space-y-1">
              <p>&gt; sys.info</p>
              <p className="text-gray-400">OS: Antigravity-Neobrutalist v1.0.0</p>
              <p className="text-gray-400">Stack: NextJS / React 19 / TypeScript / PostgreSQL</p>
              <p>&gt; profile.skills</p>
              <p className="text-gray-400">Core: ML / DL / Neural Networks / Full-Stack Web Dev</p>
              <p>&gt; status.active</p>
              <p className="text-yellow-400">Current Task: Transforming coding concepts into real-world systems.</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-auto">
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

      {/* Mini Bar when Minimized */}
      {isMinimized && (
        <div className="p-3 bg-neo-yellow/20 border-t border-[color:var(--neo-border)] flex items-center justify-between text-xs">
          <span className="font-extrabold text-[color:var(--neo-ink-soft)] italic">Window minimized to active taskbar.</span>
          <button 
            onClick={() => setIsMinimized(false)}
            className="neo-btn neo-btn-yellow !px-3 !py-1 text-[10px] font-black uppercase tracking-wider"
          >
            Restore
          </button>
        </div>
      )}
    </div>
  )
}
