'use client'
import { useState, useEffect } from 'react'

// Default categories to seed the form if none are stored in database
const defaultCategories = [
  {
    title: 'Agentic Coding & Multi-Agent Systems',
    cls: 'acc-pink',
    bgColor: 'bg-neo-pink',
    description: 'Engineering autonomous software agents that can read codebases, write code, run test suites, and self-correct using LLM reasoning loops.',
    example: 'Developer bots that auto-resolve GitHub issues, generate unit tests, and refactor legacy code.',
    animationType: 'coding'
  },
  {
    title: 'AI Workflows & LLM Orchestration',
    cls: 'acc-blue',
    bgColor: 'bg-neo-blue',
    description: 'Designing intelligent, multi-step workflows that string together LLMs, vector search, and API integrations to automate complex business processes.',
    example: 'Automation loops that ingest incoming support emails, query a vector database, and draft replies.',
    animationType: 'workflow'
  },
  {
    title: 'Full-Stack AI Application Development',
    cls: 'acc-lime',
    bgColor: 'bg-neo-lime',
    description: 'Building clean, highly interactive web applications that connect deep learning models and data dashboards to end-users.',
    example: 'Responsive Next.js applications with voice transcription, real-time sentiment analysis, and tag extraction.',
    animationType: 'fullstack'
  },
  {
    title: 'GTM Tech Stack & Growth Engineering',
    cls: 'acc-yellow',
    bgColor: 'bg-neo-yellow',
    description: 'Connecting tracking scripts, marketing automation tools, and CRM pipelines to build a unified analytics infrastructure for Go-To-Market teams.',
    example: 'Syncing user actions between Stripe, Segment, and HubSpot to automate onboarding and track CAC.',
    animationType: 'gtm'
  },
  {
    title: 'Programmatic SEO & Content Engines',
    cls: 'acc-orange',
    bgColor: 'bg-neo-orange',
    description: 'Building template-driven content engines that programmatically generate thousands of SEO-optimized pages based on structured data.',
    example: 'Systems generating unique local service landing pages using structured DB records and AI summaries.',
    animationType: 'seo'
  },
  {
    title: 'Intelligent Automation & Cognitive AI',
    cls: 'acc-pink',
    bgColor: 'bg-neo-pink',
    description: 'Building document parsing systems that extract structured keys from unstructured PDF files and scans using OCR and LLMs.',
    example: 'ETL pipelines reading invoice PDFs to extract vendor names, totals, and line items into databases.',
    animationType: 'cognitive'
  }
]

interface FormCategory {
  title: string
  cls: 'acc-pink' | 'acc-blue' | 'acc-lime' | 'acc-yellow' | 'acc-orange'
  description: string
  example: string
  animationType: 'coding' | 'workflow' | 'fullstack' | 'gtm' | 'seo' | 'cognitive' | 'security' | 'infra' | 'vision' | 'training' | 'database' | 'blockchain'
}

export default function AdminExpertisePage() {
  const [categories, setCategories] = useState<FormCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchExpertise()

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

  const fetchExpertise = async () => {
    try {
      const res = await fetch('/api/site-cards')
      if (!res.ok) {
        throw new Error('Failed to load site cards')
      }
      const data = await res.json()
      const expertiseRows = data.filter((row: any) => row.section === 'expertise')
      
      if (expertiseRows.length > 0) {
        // Map the rows to our FormCategory structure
        const mapped = expertiseRows.map((row: any) => {
          const cardData = row.card_data
          return {
            title: cardData.title || '',
            cls: cardData.cls || 'acc-pink',
            description: cardData.description || '',
            example: cardData.example || '',
            animationType: cardData.animationType || 'coding'
          }
        })
        setCategories(mapped)
      } else {
        // Fallback to default categories
        const mapped = defaultCategories.map(cat => ({
          title: cat.title,
          cls: cat.cls as any,
          description: cat.description,
          example: cat.example,
          animationType: cat.animationType as any
        }))
        setCategories(mapped)
      }
    } catch (err) {
      console.error('Error fetching expertise:', err)
      setStatusMsg({ type: 'error', text: 'Failed to load expertise categories.' })
    } finally {
      setFetching(false)
    }
  }

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        title: 'New Service',
        cls: 'acc-blue',
        description: '',
        example: '',
        animationType: 'coding'
      }
    ])
  }

  const handleDeleteCategory = (idx: number) => {
    const next = [...categories]
    next.splice(idx, 1)
    setCategories(next)
  }

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return
    const next = [...categories]
    const temp = next[idx]
    next[idx] = next[idx - 1]
    next[idx - 1] = temp
    setCategories(next)
  }

  const handleMoveDown = (idx: number) => {
    if (idx === categories.length - 1) return
    const next = [...categories]
    const temp = next[idx]
    next[idx] = next[idx + 1]
    next[idx + 1] = temp
    setCategories(next)
  }

  const handleCategoryChange = (idx: number, field: keyof FormCategory, val: string) => {
    const next = [...categories]
    next[idx] = {
      ...next[idx],
      [field]: val
    }
    setCategories(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Map categories back to rows for the site_cards PUT payload
    const cards = categories.map((cat, idx) => {
      const bgColor = cat.cls.replace('acc-', 'bg-neo-')

      return {
        sort_order: idx,
        card_data: {
          title: cat.title,
          cls: cat.cls,
          bgColor,
          description: cat.description,
          example: cat.example,
          animationType: cat.animationType
        }
      }
    })

    try {
      const res = await fetch('/api/admin/site-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'expertise',
          cards
        })
      })

      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Expertise updated successfully!' })
        fetchExpertise()
      } else {
        const errorText = await res.text()
        console.error('Failed to update expertise', errorText)
        setStatusMsg({ type: 'error', text: 'Failed to save changes.' })
      }
    } catch (err) {
      console.error('Error saving expertise', err)
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
        <h1 className="text-3xl font-extrabold inline-block bg-neo-pink border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">
          Manage Expertise & Services
        </h1>
        <button
          onClick={handleAddCategory}
          type="button"
          className="neo-btn neo-btn-lime text-sm py-2 px-4 whitespace-nowrap self-start"
        >
          + Add Service Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 mt-8">
        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="neo-card p-6 relative"
            >
              {/* Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="neo-btn !p-1.5 w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === categories.length - 1}
                  className="neo-btn !p-1.5 w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(idx)}
                  className="neo-btn neo-btn-red !p-1.5 w-8 h-8 flex items-center justify-center"
                  title="Delete Category"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div>
                  <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Service Title</label>
                  <input
                    type="text"
                    required
                    value={cat.title}
                    onChange={(e) => handleCategoryChange(idx, 'title', e.target.value)}
                    placeholder="e.g., Agentic Coding"
                    className="neo-input"
                  />
                </div>

                {/* Accent Color Class */}
                <div>
                  <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Color Theme</label>
                  <select
                    value={cat.cls}
                    onChange={(e) => handleCategoryChange(idx, 'cls', e.target.value)}
                    className="neo-select font-bold"
                  >
                    <option value="acc-pink">Pink</option>
                    <option value="acc-blue">Blue</option>
                    <option value="acc-lime">Lime (Green)</option>
                    <option value="acc-yellow">Yellow</option>
                    <option value="acc-orange">Orange</option>
                  </select>
                </div>

                {/* Animation Theme Selection */}
                <div>
                  <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Animation Theme</label>
                  <select
                    value={cat.animationType}
                    onChange={(e) => handleCategoryChange(idx, 'animationType', e.target.value as any)}
                    className="neo-select font-bold"
                  >
                    <option value="coding">Agentic Coding Editor</option>
                    <option value="workflow">AI Node Workflows</option>
                    <option value="fullstack">Full-Stack Voice Wave</option>
                    <option value="gtm">GTM Metrics Pipeline</option>
                    <option value="seo">Programmatic SEO Crawler</option>
                    <option value="cognitive">Document OCR Scanner</option>
                    <option value="security">Cyber Security Scanner</option>
                    <option value="infra">Cloud Pod Infrastructure</option>
                    <option value="vision">Computer Vision Detector</option>
                    <option value="training">ML Model Training Curve</option>
                    <option value="database">DB Replication & Sync</option>
                    <option value="blockchain">Blockchain Block Ledger</option>
                  </select>
                </div>

                {/* Description input */}
                <div className="md:col-span-3">
                  <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Service Description</label>
                  <textarea
                    required
                    value={cat.description}
                    onChange={(e) => handleCategoryChange(idx, 'description', e.target.value)}
                    placeholder="Describe what you specialize in and how you solve problems..."
                    rows={3}
                    className="neo-textarea"
                  />
                </div>

                {/* Examples input */}
                <div className="md:col-span-3">
                  <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Examples / Deliverables (E.g.)</label>
                  <input
                    type="text"
                    value={cat.example}
                    onChange={(e) => handleCategoryChange(idx, 'example', e.target.value)}
                    placeholder="e.g., Codebase analysis bots, RAG document pipelines..."
                    className="neo-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center py-10 font-bold text-gray-500">
            No services defined. Click "+ Add Service Card" to start building your cards!
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="neo-btn neo-btn-blue font-extrabold px-6 py-3 text-base flex items-center gap-2"
          >
            {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Saving...' : 'Save Expertise'}
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
