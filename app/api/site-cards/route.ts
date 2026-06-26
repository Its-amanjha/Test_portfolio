import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM site_cards ORDER BY sort_order ASC`
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/site-cards error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
