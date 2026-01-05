import Database, { type Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../../data/wishlist.db')

export const db: DatabaseType = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

export default db
