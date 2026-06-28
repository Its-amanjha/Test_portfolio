'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaLink } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoTableau } from 'react-icons/io5'
import { profile } from '@/lib/profile'
import { FooterSection } from '@/components/blocks/marketing'

const iconMap: Record<string, any> = {
  phone: FaPhoneAlt,
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
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
  { href: '/#blogs', label: 'Blogs' },
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
      <FooterSection.Simple
        brandName={profile.name}
        bio={aboutBio}
        quickLinks={quickLinks}
        socialLinks={socialLinks}
        iconMap={iconMap}
        clsMap={clsMap}
      />
    </footer>
  )
}
