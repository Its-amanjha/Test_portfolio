/**
 * One-time migration: uploads base64 images from Neon database to Vercel Blob
 * and replaces the DB records with public URLs.
 *
 * Run: node scripts/migrate-base64-to-storage.mjs
 * Requires .env.local with DATABASE_URL and BLOB_READ_WRITE_TOKEN.
 */
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
let env = {}
try {
  const envPath = resolve(__dirname, '..', '.env.local')
  const envRaw = readFileSync(envPath, 'utf-8')
  env = Object.fromEntries(
    envRaw
      .split('\n')
      .filter((l) => l.trim() && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).replace(/^['"]|['"]$/g, '').trim()]
      })
  )
} catch (err) {
  console.error('Failed to read .env.local file. Make sure it exists.')
  process.exit(1)
}

const DATABASE_URL = env.DATABASE_URL
const BLOB_READ_WRITE_TOKEN = env.BLOB_READ_WRITE_TOKEN

if (!DATABASE_URL || !BLOB_READ_WRITE_TOKEN) {
  console.error('Missing DATABASE_URL or BLOB_READ_WRITE_TOKEN in .env.local')
  process.exit(1)
}

// Inject token into environment for Vercel Blob put
process.env.BLOB_READ_WRITE_TOKEN = BLOB_READ_WRITE_TOKEN

const sql = neon(DATABASE_URL)
const TABLES = ['projects']

async function migrate() {
  console.log('Starting base64 → Vercel Blob migration...\n')

  for (const table of TABLES) {
    console.log(`\n--- Processing table: ${table} ---`)

    let rows = []
    try {
      rows = await sql(`SELECT id, image FROM ${table} WHERE image IS NOT NULL`)
    } catch (err) {
      console.error(`  Error fetching ${table}:`, err.message || err)
      continue
    }

    const base64Rows = (rows || []).filter(
      (r) => typeof r.image === 'string' && r.image.startsWith('data:')
    )

    if (base64Rows.length === 0) {
      console.log('  No base64 images found.')
      continue
    }

    console.log(`  Found ${base64Rows.length} base64 image(s). Uploading...`)

    for (const row of base64Rows) {
      const match = row.image.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) {
        console.log(`  Skipping row ${row.id}: invalid base64 format`)
        continue
      }

      const contentType = match[1]
      const ext = contentType.split('/')[1] || 'png'
      const buffer = Buffer.from(match[2], 'base64')
      const fileName = `${table}/${Date.now()}-${row.id}.${ext}`

      try {
        const blob = await put(fileName, buffer, {
          contentType,
          access: 'public',
        })

        const publicUrl = blob.url

        await sql(`UPDATE ${table} SET image = $1 WHERE id = $2`, [publicUrl, row.id])
        console.log(`  Row ${row.id} → ${publicUrl}`)
      } catch (uploadError) {
        console.error(`  Failed to upload row ${row.id}:`, uploadError.message || uploadError)
      }
    }
  }

  console.log('\nMigration complete!')
}

migrate().catch(console.error)
