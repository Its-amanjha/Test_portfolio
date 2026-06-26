import React from 'react'

interface EmptyProps {
  children: React.ReactNode
  className?: string
}

export function Empty({ children, className = '' }: EmptyProps) {
  return (
    <div 
      className={`neo-card p-8 flex flex-col items-center justify-center text-center w-full max-w-md mx-auto bg-[color:var(--neo-surface)] hover:scale-[1.01] transition-transform duration-200 ${className}`}
    >
      {children}
    </div>
  )
}

function EmptyContent({ children, className = '' }: EmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {children}
    </div>
  )
}

interface EmptyIconProps {
  className?: string
  children?: React.ReactNode
}

function EmptyIcon({ className = '', children }: EmptyIconProps) {
  return (
    <div className={`flex items-center justify-center text-[color:var(--neo-ink-soft)] ${className}`}>
      {children || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      )}
    </div>
  )
}

interface EmptyTitleProps {
  children: React.ReactNode
  className?: string
}

function EmptyTitle({ children, className = '' }: EmptyTitleProps) {
  return (
    <h3 className={`text-lg font-extrabold text-[color:var(--neo-ink)] ${className}`}>
      {children}
    </h3>
  )
}

function EmptySeparator({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`w-12 h-1 bg-[color:var(--neo-ink-soft)] rounded-full my-1 ${className}`}
      style={{ border: '1px solid var(--neo-border)' }}
    />
  )
}

interface EmptyDescriptionProps {
  children: React.ReactNode
  className?: string
}

function EmptyDescription({ children, className = '' }: EmptyDescriptionProps) {
  return (
    <p className={`text-xs md:text-sm text-[color:var(--neo-ink-soft)] font-medium max-w-xs leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

// Attach compound subcomponents
Empty.Content = EmptyContent
Empty.Icon = EmptyIcon
Empty.Title = EmptyTitle
Empty.Separator = EmptySeparator
Empty.Description = EmptyDescription
