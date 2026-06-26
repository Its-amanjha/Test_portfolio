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
    if (!body?.title) return new Response('Bad Request', { status: 400 })
    
    if (!body?.github_url && !body?.huggingface_url) {
      return new Response('At least one URL is required', { status: 400 })
    }

    const payload = {
      title: body.title,
      description: body.description || '',
      github_url: body.github_url || null,
      huggingface_url: body.huggingface_url || null,
      tags: body.tags || [],
      image: body.image || null,
      demo_video: body.demo_video || null,
    }

    const data = await sql(
      `INSERT INTO projects (title, description, github_url, huggingface_url, tags, image, demo_video)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        payload.title,
        payload.description,
        payload.github_url,
        payload.huggingface_url,
        formatTextArray(payload.tags),
        payload.image,
        payload.demo_video
      ]
    )

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('POST /api/admin/projects error', err)
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
    if (body.image !== undefined) updates.image = body.image
    if (body.demo_video !== undefined) updates.demo_video = body.demo_video
    
    if (updates.github_url !== undefined || updates.huggingface_url !== undefined) {
      const hasGithub = updates.github_url || (body.existing?.github_url)
      const hasHuggingface = updates.huggingface_url || (body.existing?.huggingface_url)
      
      if (!hasGithub && !hasHuggingface) {
        return new Response('At least one URL is required', { status: 400 })
      }
    }

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
    const query = `UPDATE projects SET ${updateKeys.join(', ')} WHERE id = $${valIdx} RETURNING *`
    const data = await sql(query, updateValues)

    await revalidateSite()
    return NextResponse.json(data?.[0])
  } catch (err) {
    console.error('PUT /api/admin/projects error', err)
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

    await sql('DELETE FROM projects WHERE id = $1', [id])
    await revalidateSite()
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/admin/projects error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
