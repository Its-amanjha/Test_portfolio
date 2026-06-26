import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM certificates ORDER BY issue_date DESC`
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/certificates error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
