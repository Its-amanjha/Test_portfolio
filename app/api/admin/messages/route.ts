import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sql } from '@/lib/db'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })

    const messages = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`
    return NextResponse.json(messages || [])
  } catch (err) {
    console.error('Error fetching contact messages:', err)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing message ID' }, { status: 400 })
    }

    await sql('DELETE FROM contact_messages WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Message deleted successfully' })
  } catch (err) {
    console.error('Error deleting contact message:', err)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
