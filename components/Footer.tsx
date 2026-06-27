'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaLink } from 'react-icons/fa'
import { SiMedium } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoTableau } from 'react-icons/io5'
import { profile } from '@/lib/profile'

const iconMap: Record<string, any> = {
  phone: FaPhoneAlt,
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  medium: SiMedium,
  tableau: IoLogoTableau,
}

const clsMap: Record<string, string> = {
  github: 'neo-tag-yellow',
  x: 'neo-tag-cyan',
  linkedin: 'neo-tag-blue',
  email: 'neo-tag-purple',
  phone: 'neo-tag-yellow',
}

const defaultSocials = [
  profile.socialLinks.github && { href: profile.socialLinks.github, label: 'GitHub', icon: 'github' },
  profile.socialLinks.x && { href: profile.socialLinks.x, label: 'X', icon: 'x' },
  profile.socialLinks.linkedin && { href: profile.socialLinks.linkedin, label: 'LinkedIn', icon: 'linkedin' },
  profile.email && { href: `mailto:${profile.email}`, label: 'Email', icon: 'email' },
  profile.phone && { href: `tel:${profile.phone.replace(/\s+/g, '')}`, label: 'Phone', icon: 'phone' },
].filter(Boolean) as Array<{ href: string; label: string; icon: string }>

const quickLinks = [
  { href: '/#top', label: 'Home' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#certifications', label: 'Certifications' },
]

export default function Footer() {
  const pathname = usePathname()
  const [socialLinks, setSocialLinks] = useState<Array<{ href: string; label: string; icon: string }>>(defaultSocials)
  const [aboutBio, setAboutBio] = useState(
    `${profile.title} focused on building machine learning and deep learning solutions for real-world problems.`
  )

  useEffect(() => {
    fetch('/api/site-cards')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        // 1. Get contact links
        const contactRow = data.find((c: any) => c.section === 'contact')
        if (contactRow?.card_data?.links) {
          const mapped = contactRow.card_data.links
            .filter((l: any) => l.icon !== 'location')
            .map((l: any) => ({
              href: l.href,
              label: l.label,
              icon: l.icon,
            }))
          if (mapped.length > 0) {
            setSocialLinks(mapped)
          }
        }
        // 2. Get about bio description
        const heroRow = data.find((c: any) => c.section === 'hero')
        if (heroRow?.card_data?.bio) {
          setAboutBio(
            `${profile.title} focused on: ${heroRow.card_data.bio.substring(0, 120)}...`
          )
        }
      })
      .catch((err) => console.error('Error fetching footer data:', err))
  }, [])

  if (pathname && pathname.startsWith('/console')) {
    return null
  }

  return (
    <footer
      className="relative z-20 mt-10"
      style={{ background: 'var(--neo-surface)', borderTop: 'var(--neo-bw) solid var(--neo-border)' }}
    >
      <div className="w-full max-w-none md:max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* About */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-yellow border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">About</h3>
            <p className="text-sm leading-relaxed font-medium text-[color:var(--neo-ink-soft)]">
              {aboutBio}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-cyan border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-semibold hover:bg-neo-yellow hover:px-1 transition-all duration-100">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-pink border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">Connect</h3>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {socialLinks.map(({ href, label, icon }) => {
                const IconComponent = iconMap[icon] || FaLink
                const colorCls = clsMap[icon] || 'neo-tag-pink'
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`neo-tag ${colorCls} w-9 h-9 !p-0 justify-center`}
                    title={label}
                    aria-label={label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-5 text-center" style={{ borderTop: '2px solid var(--neo-border)' }}>
          <p className="text-sm font-semibold text-[color:var(--neo-ink-soft)]">
            © {new Date().getFullYear()} {profile.name}. All Rights Reserved. Designed &amp; Developed by {profile.name}.
          </p>
        </div>
      </div>
    </footer>
  )
}
