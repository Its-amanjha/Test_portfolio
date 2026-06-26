import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM experiences`
    
    // Sort with "Present" entries first, then by start_date descending
    const sorted = (data || []).sort((a, b) => {
      if ((a.end_date === 'Present' && b.end_date === 'Present') || 
          (a.end_date !== 'Present' && b.end_date !== 'Present')) {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      }
      return a.end_date === 'Present' ? -1 : 1
    })

    return NextResponse.json(sorted)
  } catch (err) {
    console.error('GET /api/experience error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
