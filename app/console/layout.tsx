'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const consoleLinks = [
  { name: 'Dashboard', href: '/console', activeColor: 'bg-neo-yellow' },
  { name: 'Hero Section', href: '/console/hero', activeColor: 'bg-neo-pink' },
  { name: 'Projects', href: '/console/projects', activeColor: 'bg-neo-blue' },
  { name: 'Experience', href: '/console/experience', activeColor: 'bg-neo-lime' },
  { name: 'Certifications', href: '/console/certificates', activeColor: 'bg-neo-yellow' },
  { name: 'Expertise', href: '/console/expertise', activeColor: 'bg-neo-pink' },
  { name: 'Messages', href: '/console/messages', activeColor: 'bg-neo-purple' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      {/* Sidebar Navigation (Desktop) */}
      <aside 
        className="w-full md:w-64 fixed top-[84px] left-0 bottom-0 bg-[color:var(--neo-surface)] z-30 overflow-y-auto hidden md:block"
        style={{
          borderRight: 'var(--neo-bw) solid var(--neo-border)',
        }}
      >
        <nav className="flex flex-col h-full">
          <div 
            className="bg-black text-white px-4 py-3 font-extrabold text-xs uppercase tracking-wider text-center"
            style={{ borderBottom: 'var(--neo-bw) solid var(--neo-border)' }}
          >
            Console Menu
          </div>
          {consoleLinks.map((link) => {
            const isActive = link.href === '/console' ? pathname === '/console' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-4 text-sm font-extrabold text-[color:var(--neo-ink)] hover:text-black transition-all flex items-center justify-between ${
                  isActive 
                    ? `${link.activeColor} shadow-inner` 
                    : 'bg-[color:var(--neo-surface)] hover:bg-[color:var(--neo-surface-2)] hover:pl-8'
                }`}
                style={{ borderBottom: 'var(--neo-bw) solid var(--neo-border)' }}
              >
                <span>{link.name}</span>
                <span>→</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Top Navigation (Below Main Header) */}
      <div 
        className="w-full md:hidden fixed top-[84px] left-0 z-30 bg-[color:var(--neo-surface)]"
        style={{
          borderBottom: 'var(--neo-bw) solid var(--neo-border)',
        }}
      >
        <nav className="flex overflow-x-auto no-scrollbar gap-2 p-2 items-center">
          {consoleLinks.map((link) => {
            const isActive = link.href === '/console' ? pathname === '/console' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`neo-btn text-xs px-3.5 py-2 font-extrabold transition-all duration-100 whitespace-nowrap ${
                  isActive ? `${link.activeColor} shadow-neo-sm translate-y-[-2px] border-neo-border` : 'bg-[color:var(--neo-surface)] hover:scale-105 border-neo-border'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64">
        <main className="max-w-5xl mx-auto px-6 pb-12 pt-40 md:pt-28 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
