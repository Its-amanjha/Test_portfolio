import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM blogs ORDER BY published_date DESC`
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/blogs error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
