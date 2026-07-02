'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaCog, FaTimes, FaPlus, FaTrash, FaSave } from 'react-icons/fa'
import { SiMedium } from 'react-icons/si'
import { IoLogoTableau } from 'react-icons/io5'
import { FaXTwitter } from 'react-icons/fa6'
import CVDownloadButton from './CVDownloadButton'
import DateTimeWeather from './DateTimeWeather'
import { profile } from '@/lib/profile'
import { useMouseTilt } from '@/lib/useMouseTilt'

interface ProfileLink {
  label: string
  href: string
  icon: string
  displayText: string
}

const iconMap: Record<string, React.ReactNode> = {
  location: <FaMapMarkerAlt className="text-blue-300 light:text-blue-600" />,
  phone: <FaPhoneAlt />,
  email: <FaEnvelope />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  x: <FaXTwitter />,
  medium: <SiMedium />,
  tableau: <IoLogoTableau />,
}

const defaultLinks: ProfileLink[] = [
  { label: 'Location', href: '', icon: 'location', displayText: profile.location },
  { label: 'Phone Number', href: `tel:${profile.phone.replace(/\s+/g, '')}`, icon: 'phone', displayText: profile.phone },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'email', displayText: profile.email },
  profile.socialLinks.github ? { label: 'GitHub', href: profile.socialLinks.github, icon: 'github', displayText: profile.socialLinks.github.replace('https://', '') } : null,
  profile.socialLinks.linkedin ? { label: 'LinkedIn', href: profile.socialLinks.linkedin, icon: 'linkedin', displayText: profile.socialLinks.linkedin.replace('https://', '') } : null,
  profile.socialLinks.x ? { label: 'X', href: profile.socialLinks.x, icon: 'x', displayText: profile.socialLinks.x.replace('https://', '') } : null,
].filter(Boolean) as ProfileLink[]

interface ContactCardProps {
  initialLinks?: ProfileLink[]
  initialCvPath?: string
}

export default function ContactCard({ initialLinks, initialCvPath }: ContactCardProps) {
  const { data: session } = useSession()
  const isAdmin = !!session?.user?.email
  const showAdminControls = isAdmin

  const [editing, setEditing] = useState(false)
  const [links, setLinks] = useState<ProfileLink[]>(initialLinks && initialLinks.length > 0 ? initialLinks : defaultLinks)
  const [cvPath, setCvPath] = useState(initialCvPath || profile.cvPath)
  const [saving, setSaving] = useState(false)
  const { ref, style } = useMouseTilt(5)

  // Sync with server-provided data when it changes
  useEffect(() => {
    if (initialLinks && initialLinks.length > 0) {
      setLinks(initialLinks)
    }
    if (initialCvPath) {
      setCvPath(initialCvPath)
    }
  }, [initialLinks, initialCvPath])

  const updateLink = (index: number, field: keyof ProfileLink, value: string) => {
    setLinks(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link))
  }

  const addLink = () => {
    setLinks(prev => [...prev, { label: '', href: '', icon: 'email', displayText: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'contact',
          cards: [
            {
              card_data: { links, cvPath },
              sort_order: 0,
            },
          ],
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setEditing(false)
    } catch (err) {
      console.error('Error saving contact card:', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const cardColors = [
    'bg-neo-cyan/15 hover:bg-neo-cyan border-neo-cyan text-current',
    'bg-neo-yellow/15 hover:bg-neo-yellow border-neo-yellow text-current',
    'bg-neo-pink/15 hover:bg-neo-pink border-neo-pink text-current',
    'bg-neo-lime/15 hover:bg-neo-lime border-neo-lime text-current',
    'bg-neo-blue/15 hover:bg-neo-blue border-neo-blue text-current',
    'bg-neutral-200/50 hover:bg-neutral-300 dark:bg-neutral-800/50 dark:hover:bg-neutral-700 border-neutral-400 text-current'
  ]

  return (
    <div 
      ref={ref}
      style={style}
      id="contact-card" 
      className="relative w-full overflow-visible bg-[color:var(--neo-surface)] border-2 border-[color:var(--neo-border)] p-6 flex flex-col justify-between"
    >
      {/* Decorative Brand Sticker */}
      <div className="absolute -top-3.5 right-6 z-20 bg-neo-lime border-2 border-[color:var(--neo-border)] px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-black shadow-neo-xs rotate-2 cursor-default select-none">
        aman_jha.sys
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold inline-block bg-neo-cyan border-2 border-[color:var(--neo-border)] px-4 py-1.5 shadow-neo-sm -rotate-1 text-black select-none">
            Contact &amp; Profiles
          </h2>
          {showAdminControls && (
            <button
              onClick={() => setEditing(!editing)}
              className="neo-btn neo-btn-yellow w-10 h-10 !p-0"
              aria-label={editing ? 'Close editor' : 'Edit contact card'}
            >
              {editing ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {links.map((link, idx) => (
              <div key={idx} className="neo-panel p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Link #{idx + 1}</span>
                  <button onClick={() => removeLink(idx)} className="neo-btn neo-btn-red w-8 h-8 !p-0">
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <input type="text" value={link.label} onChange={(e) => updateLink(idx, 'label', e.target.value)} placeholder="Label (e.g. GitHub)" className="neo-input !py-1.5 text-sm" />
                <input type="text" value={link.href} onChange={(e) => updateLink(idx, 'href', e.target.value)} placeholder="URL (e.g. https://github.com/user)" className="neo-input !py-1.5 text-sm" />
                <input type="text" value={link.displayText} onChange={(e) => updateLink(idx, 'displayText', e.target.value)} placeholder="Display text (e.g. github.com/user)" className="neo-input !py-1.5 text-sm" />
                <select value={link.icon} onChange={(e) => updateLink(idx, 'icon', e.target.value)} className="neo-select !py-1.5 text-sm">
                  {Object.keys(iconMap).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            ))}

            <button onClick={addLink} className="neo-btn neo-btn-lime w-full py-2 text-sm">
              <FaPlus className="w-3 h-3" /> Add New Link
            </button>

            <div className="neo-panel p-3 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">CV Download Path</span>
              <input type="text" value={cvPath} onChange={(e) => setCvPath(e.target.value)} placeholder="/cv/Aman_CV.pdf" className="neo-input !py-1.5 text-sm" />
            </div>

            <button onClick={handleSave} disabled={saving} className="neo-btn neo-btn-cyan w-full py-2 text-sm">
              <FaSave className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            {/* Keycap grid */}
            <div className="grid grid-cols-2 gap-3 mb-6" role="list">
              {links.map((link, idx) => {
                const itemColor = cardColors[idx % cardColors.length]
                const keycapContent = (
                  <div className="flex flex-col justify-between h-full min-h-[64px]">
                    <div className="flex items-center justify-between w-full opacity-70">
                      <span className="text-[9px] font-black uppercase tracking-wider">{link.label}</span>
                      <div className="text-xs">{iconMap[link.icon] || null}</div>
                    </div>
                    <div className="text-[11px] sm:text-xs font-black truncate text-left mt-2 select-all selection:bg-neo-yellow">
                      {link.displayText}
                    </div>
                  </div>
                )

                return (
                  <div 
                    key={idx} 
                    className={`p-3 border-2 border-[color:var(--neo-border)] rounded-md shadow-[4px_4px_0px_var(--neo-border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--neo-border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer ${itemColor}`}
                    role="listitem"
                  >
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block w-full h-full text-current select-none"
                      >
                        {keycapContent}
                      </a>
                    ) : (
                      <div className="w-full h-full select-none">
                        {keycapContent}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Casing Bottom Status & Utility Tray */}
            <div className="mt-2 pt-6 border-t-2 border-dashed border-[color:var(--neo-border)]/40 space-y-4">
              {/* Spacebar space CV downloader */}
              <div className="relative group/spacebar">
                <CVDownloadButton buttonSize="lg" cvUrl={cvPath} />
              </div>
              
              {/* LED LCD Screen weather utility */}
              <div className="p-1 rounded-lg border-2 border-[color:var(--neo-border)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] bg-dot-pattern">
                <DateTimeWeather />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
