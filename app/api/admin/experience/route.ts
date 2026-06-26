import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sql } from '../../../../lib/db'
import { revalidateSite } from '../../../../lib/revalidate'

const SECRET = process.env.NEXTAUTH_SECRET || ''

const formatTextArray = (arr: string[]) => {
  if (!arr || !Array.isArray(arr)) return '{}'
  return '{' + arr.map(t => `"${t.replace(/"/g, '\\"')}"`).join(',') + '}'
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })
    
    const body = await req.json()
    if (!body?.title || !body?.organization || !body?.start_date) return new Response('Bad Request', { status: 400 })

    const payload = {
      title: body.title,
      organization: body.organization,
      location: body.location || '',
      start_date: body.start_date,
      end_date: body.end_date || 'Present',
      description: body.description || '',
      highlights: body.highlights || [],
      tags: body.tags || [],
    }

    const data = await sql(
      `INSERT INTO experiences (title, organization, location, start_date, end_date, description, highlights, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        payload.title,
        payload.organization,
        payload.location,
        payload.start_date,
        payload.end_date,
        payload.description,
        formatTextArray(payload.highlights),
        formatTextArray(payload.tags)
      ]
    )

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('POST /api/admin/experience error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })
    
    const body = await req.json()
    if (!body?.id) return new Response('Bad Request', { status: 400 })

    const updates: any = body.updates || {}
    const updateKeys: string[] = []
    const updateValues: any[] = []
    let valIdx = 1

    for (const [key, val] of Object.entries(updates)) {
      updateKeys.push(`${key} = $${valIdx}`)
      if (Array.isArray(val)) {
        updateValues.push(formatTextArray(val))
      } else {
        updateValues.push(val)
      }
      valIdx++
    }

    if (updateKeys.length === 0) {
      return new Response('Bad Request', { status: 400 })
    }

    updateValues.push(body.id)
    const query = `UPDATE experiences SET ${updateKeys.join(', ')} WHERE id = $${valIdx} RETURNING *`
    const data = await sql(query, updateValues)

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('PUT /api/admin/experience error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || !token?.email) return new Response('Not Found', { status: 404 })
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new Response('Bad Request', { status: 400 })

    await sql('DELETE FROM experiences WHERE id = $1', [id])
    await revalidateSite()
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/admin/experience error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
