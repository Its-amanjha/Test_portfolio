'use client'

import React from 'react'
import Link from 'next/link'
import { FaLink } from 'react-icons/fa'

interface SocialLink {
  href: string
  label: string
  icon: string
}

interface QuickLink {
  href: string
  label: string
}

interface FooterProps {
  brandName: string
  bio: string
  quickLinks: QuickLink[]
  socialLinks: SocialLink[]
  iconMap: Record<string, any>
  clsMap: Record<string, string>
}

export const FooterSection = {
  // Simple centered variant
  Simple: function FooterSimple({
    brandName,
    bio,
    quickLinks,
    socialLinks,
    iconMap,
    clsMap,
  }: FooterProps) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center space-y-8">
        {/* Brand Header */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform duration-100">
            <span className="text-2xl font-black bg-neo-yellow px-4 py-2 border-2 border-black shadow-neo-sm -rotate-1">
              {brandName}
            </span>
          </Link>
          <p className="text-sm font-semibold text-[color:var(--neo-ink-soft)] max-w-md mx-auto leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-bold border-b-2 border-transparent hover:border-black hover:bg-neo-yellow hover:px-1 transition-all duration-100 text-[color:var(--neo-ink)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Connect / Social Icons */}
        <div className="flex justify-center gap-3 flex-wrap">
          {socialLinks.map(({ href, label, icon }) => {
            const IconComponent = iconMap[icon] || FaLink
            const colorCls = clsMap[icon] || 'neo-tag-pink'
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`neo-tag ${colorCls} w-10 h-10 !p-0 justify-center hover:scale-105 transition-transform`}
                title={label}
                aria-label={label}
              >
                <IconComponent className="w-5 h-5" />
              </a>
            )
          })}
        </div>

        {/* Copyright */}
        <div className="w-full pt-6 border-t-2 border-black border-dashed">
          <p className="text-xs font-bold text-[color:var(--neo-ink-soft)]">
            © {new Date().getFullYear()} {brandName}. All Rights Reserved. Designed &amp; Developed by {brandName}.
          </p>
        </div>
      </div>
    )
  }
}
