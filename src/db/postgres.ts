import { Pool, type PoolConfig } from 'pg'
import type { DbConfig } from '../config'

export function createDbPool(dbConfig: DbConfig): Pool {
  const config: PoolConfig = {
    host: dbConfig.host,
    port: dbConfig.port ? Number(dbConfig.port) : undefined,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
  }
  return new Pool(config)
}

export async function ensureSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      short_code VARCHAR(32) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      click_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    ALTER TABLE urls
    ADD COLUMN IF NOT EXISTS click_count INTEGER NOT NULL DEFAULT 0
  `)
}
