import type { Metadata } from 'next'
import { profile } from '@/lib/profile'

export const metadata: Metadata = {
  title: `${profile.name}'s CV`,
  description: `${profile.name} - CV`,
}

export default function CVPage() {
  return (
    <div className="w-full min-h-[85vh] p-4" style={{ background: 'var(--neo-bg)' }}>
      <div className="neo-card w-full h-[85vh] overflow-hidden p-0">
        <iframe
          src={profile.cvPath}
          className="w-full h-full border-none"
          title={`${profile.name}'s CV`}
        />
      </div>
    </div>
  )
}
