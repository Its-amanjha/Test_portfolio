import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { put } from '@vercel/blob'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) {
      return new Response('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('video') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Video types only
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: MP4, WebM, OGG, MOV. Received: ${file.type}` 
      }, { status: 400 })
    }

    // Max 50MB
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json({ 
        error: `File too large. Maximum size is 50MB. Received: ${sizeMB}MB` 
      }, { status: 400 })
    }

    // Unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `videos/${timestamp}-${originalName}`
    
    // Upload directly to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      success: true, 
      path: blob.url,
      filename: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload video',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
