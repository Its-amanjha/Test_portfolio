import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { put } from '@vercel/blob'

const ALLOWED_TABLES = ['projects'] as const
type AllowedTable = (typeof ALLOWED_TABLES)[number]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table, id } = await params

  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return new Response('Not Found', { status: 404 })
  }

  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) {
    return new Response('Not Found', { status: 404 })
  }

  let rows: any[] = []
  try {
    // Whitelisted table name concatenation is safe
    rows = await sql(`SELECT image FROM ${table} WHERE id = $1 LIMIT 1`, [numericId])
  } catch (err) {
    console.error(`Error querying ${table}:`, err)
    return new Response('Internal Server Error', { status: 500 })
  }

  const data = rows?.[0]
  if (!data || !data.image) {
    return new Response('Not Found', { status: 404 })
  }

  const image: string = data.image

  // Already a URL — redirect to it
  if (image.startsWith('http')) {
    return NextResponse.redirect(image, { status: 302 })
  }

  // Parse base64 data URL: data:<mime>;base64,<data>
  const match = image.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return new Response('Not Found', { status: 404 })
  }

  const contentType = match[1]
  const buffer = Buffer.from(match[2], 'base64')
  const ext = contentType.split('/')[1] || 'png'
  const fileName = `${table}/${Date.now()}-${numericId}.${ext}`

  try {
    // Upload to Vercel Blob
    const blob = await put(fileName, buffer, {
      contentType,
      access: 'public',
    })

    const publicUrl = blob.url

    // Update Neon DB so future requests bypass this path
    await sql(`UPDATE ${table} SET image = $1 WHERE id = $2`, [publicUrl, numericId])

    return NextResponse.redirect(publicUrl, { status: 302 })
  } catch (uploadError) {
    console.error('Vercel Blob upload / database update error:', uploadError)
    
    // Fallback: serve base64 directly with aggressive caching
    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    })
  }
}
