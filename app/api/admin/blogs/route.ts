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
    if (!body?.title || !body?.published_date) return new Response('Bad Request', { status: 400 })

    const payload = {
      title: body.title,
      summary: body.summary || '',
      url: body.url || '',
      image: body.image || '',
      published_date: body.published_date,
      tags: body.tags || [],
      content: body.content || '',
    }

    const data = await sql(
      `INSERT INTO blogs (title, summary, url, image, published_date, tags, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        payload.title,
        payload.summary,
        payload.url,
        payload.image,
        payload.published_date,
        formatTextArray(payload.tags),
        payload.content,
      ]
    )

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('POST /api/admin/blogs error', err)
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
    const query = `UPDATE blogs SET ${updateKeys.join(', ')} WHERE id = $${valIdx} RETURNING *`
    const data = await sql(query, updateValues)

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('PUT /api/admin/blogs error', err)
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

    await sql('DELETE FROM blogs WHERE id = $1', [id])
    await revalidateSite()
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/admin/blogs error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
