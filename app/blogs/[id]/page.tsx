'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import NeoLoader from '@/components/NeoLoader'
import TagBadge from '@/components/TagBadge'
import { parseMarkdownToHtml } from '@/lib/markdown'

interface IBlog {
  id: number
  title: string
  summary?: string
  url?: string
  image?: string
  published_date: string
  tags?: string[]
  content?: string
}

export default function BlogDetailsPage() {
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<IBlog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchBlogData = async () => {
      try {
        const res = await fetch(`/api/blogs?id=${blogId}`)
        if (!res.ok) {
          if (active) setBlog(null)
          return
        }
        const data: IBlog = await res.json()
        if (!active) return
        setBlog(data)
        window.scrollTo(0, 0)
      } catch (err) {
        console.error('Failed to fetch blog data', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchBlogData()
    return () => {
      active = false
    }
  }, [blogId])

  if (loading) {
    return <NeoLoader />
  }

  if (!blog) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="neo-card neo-card-alt text-center px-10 py-12 -rotate-1">
          <h1 className="text-3xl font-extrabold mb-6">Blog Post Not Found</h1>
          <Link href="/" className="neo-btn neo-btn-yellow">Back to Home Page</Link>
        </div>
      </div>
    )
  }

  const parsedContent = parseMarkdownToHtml(blog.content || '')

  return (
    <main className="min-h-screen pb-12 overflow-x-clip">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="neo-btn neo-btn-cyan text-sm">
            ← Back to Home Page
          </Link>
        </div>

        {/* Article Container */}
        <article className="neo-card p-6 sm:p-10 md:p-12 bg-[color:var(--neo-surface)]">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-neo-yellow border-2 border-black px-2.5 py-1 rounded shadow-neo-sm">
              Published: {blog.published_date}
            </span>
            {blog.url && (
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn text-xs px-2.5 py-1 font-bold bg-neo-cyan"
              >
                View on External Platform 🔗
              </a>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words text-black">
            {blog.title}
          </h1>

          {blog.summary && (
            <p className="text-base sm:text-lg mb-8 leading-relaxed font-bold text-[color:var(--neo-ink-soft)] bg-[color:var(--neo-bg-alt)] border-2 border-black p-4 rounded shadow-neo-sm">
              {blog.summary}
            </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-6 border-b-2 border-dashed border-neo-border mb-8">
              {blog.tags.map((tag, idx) => (
                <TagBadge key={idx} tag={tag} variant="yellow" />
              ))}
            </div>
          )}

          {/* Rendered HTML Content */}
          {blog.content ? (
            <div
              className="neo-markdown-body prose max-w-none text-black leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="text-gray-400 italic">No content available for this post.</p>
          )}
        </article>
      </div>
    </main>
  )
}
