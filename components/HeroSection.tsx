'use client'
import { memo } from 'react'

interface HeroTitleProps {
  badge?: string
  headingPrefix?: string
  headingHighlight?: string
  description: string
}

function HeroTitle({
  badge = 'AI & FULL-STACK ENGINEER',
  headingPrefix = 'Welcome to my',
  headingHighlight = 'Portfolio',
  description
}: HeroTitleProps) {
  return (
    <>
      <span className="neo-tag neo-tag-pink mb-6 w-fit !text-sm !md:text-base !px-4 !py-1.5 uppercase tracking-wider font-extrabold shadow-neo-sm hover:scale-105 transition-transform cursor-default">
        {badge}
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.05]">
        {headingPrefix}{' '}
        <span className="bg-neo-yellow px-2 border-neo border-neo-border shadow-neo-sm inline-block -rotate-1 text-black">
          {headingHighlight}
        </span>
      </h1>
      <p className="text-base md:text-lg text-[color:var(--neo-ink-soft)] font-medium mb-8 leading-relaxed">
        {description}
      </p>
    </>
  )
}

export default memo(HeroTitle)
