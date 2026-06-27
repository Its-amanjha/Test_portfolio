'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

interface LoginProps {
  callbackUrl?: string
}

export default function LoginFormClient({ callbackUrl = '/console' }: LoginProps) {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLocalError('')
    
    if (!email || !password) {
      setLocalError('Please fill in all fields.')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        setLocalError('Invalid email or password.')
      } else {
        window.location.href = callbackUrl
      }
    } catch (err) {
      console.error('Login error:', err)
      setLocalError('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 neo-card p-6 sm:p-8 -rotate-1 bg-[color:var(--neo-surface)]">
      <h2 className="text-2xl font-extrabold mb-6 inline-block bg-neo-yellow border-neo border-neo-border px-3 py-1 shadow-neo-sm -rotate-1 text-black">
        Console Login
      </h2>
      
      {(localError || error === 'CredentialsSignin') && (
        <div className="mb-4 p-3 bg-neo-red border-neo border-neo-border shadow-neo-sm font-bold text-sm text-black">
          {localError || 'Invalid credentials. Please try again.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-extrabold mb-1.5 uppercase tracking-wider text-[color:var(--neo-ink)]">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            required
            className="neo-input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-extrabold mb-1.5 uppercase tracking-wider text-[color:var(--neo-ink)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="neo-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="neo-btn neo-btn-blue w-full mt-4 py-3"
        >
          {loading ? 'Signing In...' : 'Access Console →'}
        </button>
      </form>
    </div>
  )
}
