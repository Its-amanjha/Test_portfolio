'use client'

import { useState, useEffect } from 'react'
import { Empty } from '@/components/retroui'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchMessages()

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

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages')
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setStatusMsg({ type: 'error', text: 'Failed to load messages.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete message')
      setStatusMsg({ type: 'success', text: 'Message deleted successfully!' })
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
    } catch (err) {
      console.error('Error deleting message:', err)
      setStatusMsg({ type: 'error', text: 'Failed to delete message.' })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const query = searchQuery.toLowerCase()
    return (
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-neo-border border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold inline-block bg-neo-purple border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1 text-black">
          Contact Messages ({messages.length})
        </h1>
        
        {/* Search filter */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className={`w-full px-4 py-2 border-2 border-neo-border rounded-neo focus:outline-none focus:ring-2 focus:ring-neo-purple ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-400'
            }`}
          />
        </div>
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

      <div className="space-y-6 mt-8">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-neo border-neo border-neo-border shadow-neo-sm relative flex flex-col justify-between ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neo-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[color:var(--neo-ink)]">{msg.name}</h3>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs font-semibold text-neo-blue hover:underline"
                >
                  {msg.email}
                </a>
              </div>
              <span className="text-xs font-mono text-[color:var(--neo-muted)]">
                {new Date(msg.created_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>

            {/* Message content */}
            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap flex-grow text-[color:var(--neo-ink-soft)] pb-4">
              {msg.message}
            </p>

            {/* Action buttons */}
            <div className="border-t border-neo-border pt-4 flex justify-end">
              {deletingId === msg.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-500">Are you sure?</span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="neo-btn neo-btn-red text-xs py-1 px-3"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="neo-btn text-xs py-1 px-3 bg-gray-500 text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingId(msg.id)}
                  className="neo-btn neo-btn-red text-xs py-1.5 px-3"
                >
                  Delete Message
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <Empty className="acc-purple">
            <Empty.Content>
              <Empty.Icon className="size-10 md:size-12 text-[color:var(--neo-purple)]" />
              <Empty.Title>No Messages Found</Empty.Title>
              <Empty.Separator />
              <Empty.Description>
                {searchQuery 
                  ? 'No messages matched your search query. Try typing something else!' 
                  : 'No contact messages received yet. Your inbox is clean!'}
              </Empty.Description>
            </Empty.Content>
          </Empty>
        )}
      </div>
    </section>
  )
}
