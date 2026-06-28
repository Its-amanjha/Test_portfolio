'use client'
import { useState, useEffect } from 'react'
import TagSearchInput from '@/components/TagSearchInput'

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

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    url: '',
    image: '',
    published_date: '',
    tags: '',
    content: '',
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
    
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

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (!res.ok) {
        setBlogs([])
        return
      }
      const data = await res.json()
      setBlogs(data)
    } catch (err) {
      console.error('Error fetching blogs', err)
      setBlogs([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      title: formData.title,
      summary: formData.summary,
      url: formData.url,
      image: formData.image,
      published_date: formData.published_date,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      content: formData.content,
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', summary: '', url: '', image: '', published_date: '', tags: '', content: '' })
          fetchBlogs()
          setStatusMsg({ type: 'success', text: 'Blog post updated successfully!' })
        } else {
          setStatusMsg({ type: 'error', text: 'Failed to update blog post.' })
        }
      } else {
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', summary: '', url: '', image: '', published_date: '', tags: '', content: '' })
          fetchBlogs()
          setStatusMsg({ type: 'success', text: 'Blog post added successfully!' })
        } else {
          setStatusMsg({ type: 'error', text: 'Failed to add blog post.' })
        }
      }
    } catch (err) {
      console.error('Error saving blog post', err)
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchBlogs()
        setStatusMsg({ type: 'success', text: 'Blog post deleted successfully!' })
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to delete blog post.' })
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (blog: IBlog) => {
    setEditingId(String(blog.id))
    setFormData({
      title: blog.title,
      summary: blog.summary || '',
      url: blog.url || '',
      image: blog.image || '',
      published_date: blog.published_date,
      tags: blog.tags ? blog.tags.join(', ') : '',
      content: blog.content || '',
    })
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold inline-block bg-neo-yellow border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1 text-black">
          Manage Blogs
        </h1>
      </div>

      {statusMsg && (
        <div className={`p-4 font-bold border-2 border-black rounded ${statusMsg.type === 'success' ? 'bg-neo-lime text-black' : 'bg-neo-red text-white'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Blog form cockpit */}
      <form onSubmit={handleSubmit} className="neo-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Title *</label>
              <input
                type="text"
                required
                name="title"
                autoComplete="off"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neo-input"
                placeholder="e.g. My first Neobrutalist web app…"
              />
            </div>

            <div>
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Summary Description</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="neo-textarea"
                rows={4}
                placeholder="Brief summary of the article…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Published Date *</label>
                <input
                  type="date"
                  required
                  name="published_date"
                  autoComplete="off"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="neo-input"
                />
              </div>

              <div>
                <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Redirect URL (Optional)</label>
                <input
                  type="url"
                  name="url"
                  autoComplete="off"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="neo-input"
                  placeholder="https://medium.com/…"
                />
              </div>
            </div>

            <div>
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)]">Technologies/Tags (comma-separated)</label>
              <TagSearchInput
                value={formData.tags}
                onChange={(val) => setFormData({ ...formData, tags: val })}
                className="neo-input"
                placeholder="Next.js, Tailwind, React"
              />
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="flex-grow flex flex-col">
              <label className="block font-extrabold mb-2 text-sm text-[color:var(--neo-ink)] flex-shrink-0">
                Article Content (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="neo-textarea font-mono text-sm flex-grow"
                rows={12}
                placeholder="# My Heading&#10;&#10;Use standard markdown tags here. They will render styled perfectly according to the Neobrutalist design."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="neo-btn neo-btn-yellow text-sm font-extrabold"
          >
            {loading ? 'Saving…' : editingId ? 'Update Post' : 'Publish Post'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', summary: '', url: '', image: '', published_date: '', tags: '', content: '' })
              }}
              className="neo-btn text-sm font-extrabold bg-[color:var(--neo-bg-alt)] hover:bg-[color:var(--neo-bg)]"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Blogs list */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold">All Published Blogs</h2>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="neo-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neo-yellow px-2 py-0.5 border border-black rounded">
                      {blog.published_date}
                    </span>
                    {blog.url && (
                      <span className="text-[9px] font-bold bg-neo-cyan px-1.5 py-0.5 border border-black rounded text-black truncate">
                        🔗 External
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-lg line-clamp-1">{blog.title}</h3>
                  <p className="text-sm text-[color:var(--neo-ink-soft)] line-clamp-2 mt-1">{blog.summary || 'No summary provided.'}</p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-bold border border-black px-1.5 rounded bg-[color:var(--neo-bg-alt)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-dashed border-[color:var(--neo-border)]">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="neo-btn text-xs px-3 py-1 font-bold bg-neo-lime"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(blog.id))}
                    disabled={deletingId === String(blog.id)}
                    className="neo-btn text-xs px-3 py-1 font-bold bg-neo-red text-white"
                  >
                    {deletingId === String(blog.id) ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-card p-12 text-center text-[color:var(--neo-muted)]">
            No blogs published yet. Use the form above to add your first post!
          </div>
        )}
      </div>
    </section>
  )
}
