import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Simple PBKDF2 hashing functions for seeding
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

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
const ADMIN_EMAIL = env.ADMIN_EMAIL
const ADMIN_PASSWORD = env.ADMIN_PASSWORD

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL is missing in .env.local')
  process.exit(1)
}

console.log('Connecting to Neon database...')
const sql = neon(DATABASE_URL)

async function setup() {
  try {
    console.log('Creating "admins" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('Creating "projects" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        github_url TEXT,
        huggingface_url TEXT,
        tags TEXT[] DEFAULT '{}',
        image TEXT,
        demo_video TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('Dropping obsolete tables if they exist...')
    await sql`DROP TABLE IF EXISTS fullstack_projects CASCADE;`
    await sql`DROP TABLE IF EXISTS data_analytics_projects CASCADE;`
    await sql`DROP TABLE IF EXISTS articles CASCADE;`

    console.log('Creating "experiences" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        location TEXT DEFAULT '',
        start_date TEXT NOT NULL,
        end_date TEXT DEFAULT 'Present',
        description TEXT DEFAULT '',
        highlights TEXT[] DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('Creating "certificates" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        credential_url TEXT,
        description TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('Creating "site_cards" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS site_cards (
        id SERIAL PRIMARY KEY,
        section TEXT NOT NULL,
        card_data JSONB NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('Creating "contact_messages" table...')
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    console.log('All tables created successfully!')

    // Seeding admin account
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      console.log(`Seeding admin account for email: ${ADMIN_EMAIL}...`)
      const passwordHash = hashPassword(ADMIN_PASSWORD)

      // Insert or update admin password hash
      const result = await sql`
        INSERT INTO admins (email, password_hash)
        VALUES (${ADMIN_EMAIL}, ${passwordHash})
        ON CONFLICT (email) 
        DO UPDATE SET password_hash = ${passwordHash}
        RETURNING id, email;
      `
      console.log('Admin account seeded successfully:', result[0])
    } else {
      console.warn('Warning: ADMIN_EMAIL or ADMIN_PASSWORD is empty in .env.local. Admin account was not seeded.')
    }

    console.log('\nSetup completed successfully!')
  } catch (err) {
    console.error('Database migration/seed error:', err)
    process.exit(1)
  }
}

setup()
