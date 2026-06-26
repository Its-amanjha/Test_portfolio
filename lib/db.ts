import { Pool } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn('DATABASE_URL is missing in environment variables. Database queries will fail.')
}

// Establish a connection pool for serverless Postgres query execution
const pool = new Pool({
  connectionString: databaseUrl || '',
})

/**
 * Smart query runner.
 * Supports both tagged template literal calls:
 *   await sql`SELECT * FROM projects WHERE id = ${id}`
 * And classic parameterized string calls:
 *   await sql("SELECT * FROM projects WHERE id = $1", [id])
 */
export async function sql(
  strings: TemplateStringsArray | string,
  ...params: any[]
): Promise<any[]> {
  try {
    if (Array.isArray(strings) && 'raw' in strings) {
      // 1. Tagged Template Literal: sql`SELECT * FROM table WHERE id = ${id}`
      let queryText = strings[0]
      const values: any[] = []
      
      for (let i = 1; i < strings.length; i++) {
        queryText += `$${i}` + strings[i]
        values.push(params[i - 1])
      }
      
      const res = await pool.query(queryText, values)
      return res.rows || []
    } else {
      // 2. Parameterized Function: sql("SELECT * FROM table WHERE id = $1", [id])
      const queryText = strings as string
      const values = (params[0] as any[]) || []
      
      const res = await pool.query(queryText, values)
      return res.rows || []
    }
  } catch (error) {
    console.error('Neon Pool Query Error:', error)
    throw error
  }
}

export default sql
