'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaCog, FaTimes, FaPlus, FaTrash, FaSave, FaLink } from 'react-icons/fa'
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

  const locationLink = links.find(l => l.icon === 'location') || { displayText: profile.location }
  const phoneLink = links.find(l => l.icon === 'phone') || { displayText: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` }
  const emailLink = links.find(l => l.icon === 'email') || { displayText: profile.email, href: `mailto:${profile.email}` }

  // Extract remaining social link keycaps
  const socialLinks = links.filter(l => !['location', 'phone', 'email'].includes(l.icon))

  const socialIconMap: Record<string, React.ReactNode> = {
    github: <FaGithub className="w-8 h-8 sm:w-10 h-10 mb-1.5" />,
    linkedin: <FaLinkedin className="w-8 h-8 sm:w-10 h-10 mb-1.5" />,
    x: <FaXTwitter className="w-8 h-8 sm:w-10 h-10 mb-1.5" />,
    medium: <SiMedium className="w-8 h-8 sm:w-10 h-10 mb-1.5" />,
    tableau: <IoLogoTableau className="w-8 h-8 sm:w-10 h-10 mb-1.5" />,
  }

  const socialColorMap: Record<string, string> = {
    github: 'bg-neo-lime/15 hover:bg-neo-lime border-neo-lime text-current',
    linkedin: 'bg-neo-blue/15 hover:bg-neo-blue border-neo-blue text-current',
    x: 'bg-neutral-200/50 hover:bg-neutral-300 dark:bg-neutral-800/50 dark:hover:bg-neutral-700 border-neutral-400 text-current',
    medium: 'bg-neo-pink/15 hover:bg-neo-pink border-neo-pink text-current',
    tableau: 'bg-neo-yellow/15 hover:bg-neo-yellow border-neo-yellow text-current',
  }

  return (
    <div 
      ref={ref}
      style={style}
      id="contact-card" 
      className="relative w-full overflow-visible bg-[color:var(--neo-surface)] border-2 border-black shadow-[8px_8px_0px_#000] p-6 flex flex-col justify-between"
    >
      {/* Decorative Brand Sticker */}
      <div className="absolute -top-3.5 right-6 z-20 bg-neo-lime border-2 border-black px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-black shadow-neo-xs rotate-2 cursor-default select-none">
        aman_jha.sys
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold inline-block bg-neo-cyan border-2 border-black px-4 py-1.5 shadow-[4px_4px_0_#000] -rotate-1 text-black select-none">
            Contact &amp; Profiles
          </h2>
          {showAdminControls && (
            <button
              onClick={() => setEditing(!editing)}
              className="neo-btn neo-btn-yellow w-10 h-10 !p-0 border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-[2px] active:shadow-none"
              aria-label={editing ? 'Close editor' : 'Edit contact card'}
            >
              {editing ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {links.map((link, idx) => (
              <div key={idx} className="neo-panel p-3 space-y-2 border-2 border-black">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Link #{idx + 1}</span>
                  <button onClick={() => removeLink(idx)} className="neo-btn neo-btn-red w-8 h-8 !p-0 border-2 border-black shadow-[2px_2px_0_#000]">
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <input type="text" value={link.label} onChange={(e) => updateLink(idx, 'label', e.target.value)} placeholder="Label (e.g. GitHub)" className="neo-input !py-1.5 text-sm border-2 border-black" />
                <input type="text" value={link.href} onChange={(e) => updateLink(idx, 'href', e.target.value)} placeholder="URL (e.g. https://github.com/user)" className="neo-input !py-1.5 text-sm border-2 border-black" />
                <input type="text" value={link.displayText} onChange={(e) => updateLink(idx, 'displayText', e.target.value)} placeholder="Display text (e.g. github.com/user)" className="neo-input !py-1.5 text-sm border-2 border-black" />
                <select value={link.icon} onChange={(e) => updateLink(idx, 'icon', e.target.value)} className="neo-select !py-1.5 text-sm border-2 border-black">
                  {Object.keys(iconMap).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            ))}

            <button onClick={addLink} className="neo-btn neo-btn-lime w-full py-2 text-sm border-2 border-black shadow-[4px_4px_0_#000]">
              <FaPlus className="w-3 h-3" /> Add New Link
            </button>

            <div className="neo-panel p-3 space-y-2 border-2 border-black">
              <span className="text-xs font-extrabold uppercase tracking-wider">CV Download Path</span>
              <input type="text" value={cvPath} onChange={(e) => setCvPath(e.target.value)} placeholder="/cv/Aman_CV.pdf" className="neo-input !py-1.5 text-sm border-2 border-black" />
            </div>

            <button onClick={handleSave} disabled={saving} className="neo-btn neo-btn-cyan w-full py-2 text-sm border-2 border-black shadow-[4px_4px_0_#000]">
              <FaSave className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            {/* Primary Credentials Panel */}
            <div className="bg-[color:var(--neo-surface)] border-2 border-black p-4 rounded shadow-[4px_4px_0px_#000] mb-6">
              {/* Location Tag & Phone Tag */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-neo-cyan/20 border-2 border-black px-2.5 py-1 rounded text-xs font-black text-current">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>{locationLink.displayText}</span>
                </div>
                {phoneLink.href ? (
                  <a 
                    href={phoneLink.href}
                    className="flex items-center gap-1.5 bg-neo-yellow/20 border-2 border-black px-2.5 py-1 rounded text-xs font-black text-current hover:bg-neo-yellow hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#000] transition-all duration-150"
                  >
                    <FaPhoneAlt />
                    <span>{phoneLink.displayText}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 bg-neo-yellow/20 border-2 border-black px-2.5 py-1 rounded text-xs font-black text-current">
                    <FaPhoneAlt />
                    <span>{phoneLink.displayText}</span>
                  </div>
                )}
              </div>
              {/* Email Link Block */}
              {emailLink.href ? (
                <a 
                  href={emailLink.href} 
                  className="flex items-center justify-between p-3 bg-neo-pink/15 hover:bg-neo-pink border-2 border-black rounded text-xs sm:text-sm font-black text-current transition-all duration-150 group/email select-all shadow-[2px_2px_0_#000] hover:translate-y-[-1px] hover:translate-x-[1px] hover:shadow-[3px_3px_0_#000] active:translate-y-[0px] active:translate-x-[0px] active:shadow-none"
                >
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-neo-pink" />
                    <span className="truncate max-w-[180px] sm:max-w-xs">{emailLink.displayText}</span>
                  </div>
                  <span className="text-xs group-hover/email:translate-x-1 transition-transform">➔</span>
                </a>
              ) : (
                <div className="flex items-center justify-between p-3 bg-neo-pink/15 border-2 border-black rounded text-xs sm:text-sm font-black text-current select-all">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-neo-pink" />
                    <span>{emailLink.displayText}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Grid (Big Iconic Buttons) */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {socialLinks.map((link, idx) => {
                const itemColor = socialColorMap[link.icon] || 'bg-neutral-200/50 hover:bg-neutral-300 dark:bg-neutral-800/50 dark:hover:bg-neutral-700 border-neutral-400 text-current'
                const bigIcon = socialIconMap[link.icon] || <FaLink className="w-8 h-8 sm:w-10 h-10 mb-1.5" />
                const keycapContent = (
                  <div className="flex flex-col items-center justify-center p-2 text-center select-none">
                    {bigIcon}
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                      {link.label}
                    </span>
                  </div>
                )

                return link.href ? (
                  <a 
                    key={idx}
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 ${itemColor}`}
                  >
                    {keycapContent}
                  </a>
                ) : (
                  <div 
                    key={idx}
                    className={`flex flex-col items-center justify-center border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 ${itemColor}`}
                  >
                    {keycapContent}
                  </div>
                )
              })}
            </div>
            
            {/* Casing Bottom Status & Utility Tray */}
            <div className="mt-2 pt-6 border-t-2 border-dashed border-black/20 space-y-4">
              {/* Spacebar space CV downloader */}
              <div className="relative group/spacebar">
                <CVDownloadButton buttonSize="lg" cvUrl={cvPath} />
              </div>
              
              {/* LED LCD Screen weather utility */}
              <div className="p-1 rounded-lg border-2 border-black shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] bg-dot-pattern">
                <DateTimeWeather />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
