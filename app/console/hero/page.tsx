'use client'
import { useState, useEffect } from 'react'
import { profile } from '../../../lib/profile'

interface HeroData {
  badge: string
  headingPrefix: string
  headingHighlight: string
  bio: string
  typewriterSentences: string[]
}

export default function AdminHeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    badge: '',
    headingPrefix: '',
    headingHighlight: '',
    bio: '',
    typewriterSentences: []
  })
  
  const [typewriterText, setTypewriterText] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchHeroData()

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!statusMsg) return
    const t = setTimeout(() => setStatusMsg(null), 5000)
    return () => clearTimeout(t)
  }, [statusMsg])

  const fetchHeroData = async () => {
    try {
      const res = await fetch('/api/site-cards')
      if (!res.ok) {
        throw new Error('Failed to load site cards')
      }
      const data = await res.json()
      const heroRow = data.find((row: any) => row.section === 'hero')
      
      if (heroRow && heroRow.card_data) {
        const d = heroRow.card_data
        const fetchedData = {
          badge: d.badge || profile.title,
          headingPrefix: d.headingPrefix || 'Welcome to my',
          headingHighlight: d.headingHighlight || 'Portfolio',
          bio: d.bio || profile.bio,
          typewriterSentences: Array.isArray(d.typewriterSentences) ? d.typewriterSentences : profile.typewriterSentences
        }
        setHeroData(fetchedData)
        setTypewriterText(fetchedData.typewriterSentences.join('\n'))
      } else {
        // Fallback to profile.ts defaults
        setHeroData({
          badge: profile.title,
          headingPrefix: 'Welcome to my',
          headingHighlight: 'Portfolio',
          bio: profile.bio,
          typewriterSentences: profile.typewriterSentences
        })
        setTypewriterText(profile.typewriterSentences.join('\n'))
      }
    } catch (err) {
      console.error('Error fetching hero data:', err)
      setStatusMsg({ type: 'error', text: 'Failed to load hero section configuration.' })
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field: keyof HeroData, val: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: val
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Parse typewriter sentences by newline, filtering out empty rows
    const parsedSentences = typewriterText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      section: 'hero',
      cards: [
        {
          sort_order: 0,
          card_data: {
            badge: heroData.badge,
            headingPrefix: heroData.headingPrefix,
            headingHighlight: heroData.headingHighlight,
            bio: heroData.bio,
            typewriterSentences: parsedSentences
          }
        }
      ]
    }

    try {
      const res = await fetch('/api/admin/site-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Hero section updated successfully!' })
        fetchHeroData()
      } else {
        const errorText = await res.text()
        console.error('Failed to update hero section', errorText)
        setStatusMsg({ type: 'error', text: 'Failed to save changes.' })
      }
    } catch (err) {
      console.error('Error saving hero section:', err)
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-neo-border border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold inline-block bg-neo-pink border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1 text-black">
          Manage Hero Section
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="neo-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Badge */}
            <div className="md:col-span-1">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">
                Badge Tag Text
              </label>
              <input
                type="text"
                required
                value={heroData.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
                placeholder="e.g. AI & FULL-STACK ENGINEER"
                className="neo-input"
              />
            </div>

            {/* Heading Prefix */}
            <div className="md:col-span-1">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">
                Heading Prefix
              </label>
              <input
                type="text"
                required
                value={heroData.headingPrefix}
                onChange={(e) => handleChange('headingPrefix', e.target.value)}
                placeholder="e.g. Welcome to my"
                className="neo-input"
              />
            </div>

            {/* Heading Highlight */}
            <div className="md:col-span-1">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">
                Heading Highlight Text
              </label>
              <input
                type="text"
                required
                value={heroData.headingHighlight}
                onChange={(e) => handleChange('headingHighlight', e.target.value)}
                placeholder="e.g. Portfolio"
                className="neo-input"
              />
            </div>

            {/* Bio description paragraph */}
            <div className="md:col-span-2">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">
                Bio Description Paragraph
              </label>
              <textarea
                required
                value={heroData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Describe your credentials, engineering interests, and summary..."
                rows={8}
                className="neo-textarea"
              />
            </div>

            {/* Typewriter phrases */}
            <div className="md:col-span-1">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">
                Typewriter Phrases (One per line)
              </label>
              <textarea
                required
                value={typewriterText}
                onChange={(e) => setTypewriterText(e.target.value)}
                placeholder="Hello, I'm Aman.&#10;AI & Full-Stack Engineer."
                rows={8}
                className="neo-textarea font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="neo-btn neo-btn-blue font-extrabold px-6 py-3 text-base flex items-center gap-2"
          >
            {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>

        {statusMsg && (
          <div
            className={`px-4 py-3 rounded-neo border-2 font-bold text-sm flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? isDarkMode
                  ? 'bg-green-900/50 text-green-300 border-green-700'
                  : 'bg-green-50 text-green-700 border-green-300'
                : isDarkMode
                ? 'bg-red-900/50 text-red-300 border-red-700'
                : 'bg-red-50 text-red-700 border-red-300'
            }`}
          >
            {statusMsg.type === 'success' ? '✓' : '✕'} {statusMsg.text}
          </div>
        )}
      </form>
    </section>
  )
}
