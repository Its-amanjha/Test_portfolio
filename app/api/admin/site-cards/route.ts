import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { revalidateSite } from '../../../../lib/revalidate'
import { sql } from '../../../../lib/db'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })

    const body = await req.json()
    const { section, cards } = body as {
      section: 'contact' | 'qr' | 'expertise' | 'hero'
      cards: { card_data: Record<string, unknown>; sort_order: number }[]
    }

    if (!section || !Array.isArray(cards)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Delete existing cards for this section
    await sql('DELETE FROM site_cards WHERE section = $1', [section])

    // Insert new cards
    const insertedRows: any[] = []
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i]
      const order = c.sort_order ?? i
      const [row] = await sql(
        `INSERT INTO site_cards (section, card_data, sort_order)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [section, JSON.stringify(c.card_data), order]
      )
      insertedRows.push(row)
    }

    await revalidateSite()
    return NextResponse.json(insertedRows)
  } catch (err) {
    console.error('Error updating site cards in Neon:', err)
    return NextResponse.json({ error: 'Failed to save site cards' }, { status: 500 })
  }
}
