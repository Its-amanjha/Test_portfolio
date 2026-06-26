import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { put } from '@vercel/blob'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function POST(req: NextRequest) {
  // Validate NextAuth session JWT token
  const token = await getToken({ req, secret: SECRET })
  if (!token || !token?.email) {
    return new Response('Not Found', { status: 404 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'png'
  const fileName = `qr/qr-${Date.now()}.${ext}`

  try {
    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Vercel Blob QR upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
