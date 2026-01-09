import Database, { type Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../../data/wishlist.db')

export const db: DatabaseType = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Migration: Add share_token column if it doesn't exist
try {
  const columns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[]
  const hasShareToken = columns.some(col => col.name === 'share_token')
  if (!hasShareToken) {
    db.exec('ALTER TABLE users ADD COLUMN share_token TEXT UNIQUE')
    db.exec('CREATE INDEX IF NOT EXISTS idx_users_share_token ON users(share_token)')
    console.log('Added share_token column to users table')
  }
} catch (error) {
  console.error('Migration error:', error)
}

export default db
