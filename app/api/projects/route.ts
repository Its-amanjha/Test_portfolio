import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM projects ORDER BY created_at DESC`
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/projects error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
