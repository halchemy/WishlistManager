import { Router } from 'express'
import { randomUUID } from 'crypto'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'
import type { Category, AuthRequest } from '../types/index.js'

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Default categories to create for new users
const DEFAULT_CATEGORIES = [
  { name: 'ファッション', color: '#EC4899' },
  { name: '家電', color: '#3B82F6' },
  { name: '書籍', color: '#10B981' },
  { name: 'ゲーム', color: '#8B5CF6' },
  { name: '食品', color: '#F59E0B' },
  { name: 'その他', color: '#6B7280' },
]

// Helper function to convert DB category to API response
function toApiCategory(category: Category) {
  return {
    id: category.id,
    userId: category.user_id,
    name: category.name,
    color: category.color,
    createdAt: category.created_at,
  }
}

// Initialize default categories for a user if they don't have any
function initializeDefaultCategories(userId: string) {
  const existingCategories = db.prepare(
    'SELECT COUNT(*) as count FROM categories WHERE user_id = ?'
  ).get(userId) as { count: number }

  if (existingCategories.count === 0) {
    const now = new Date().toISOString()
    const insertStmt = db.prepare(`
      INSERT INTO categories (id, user_id, name, color, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const cat of DEFAULT_CATEGORIES) {
      insertStmt.run(randomUUID(), userId, cat.name, cat.color, now)
    }
  }
}

// Get all categories (initializes defaults if needed)
router.get('/', (req: AuthRequest, res) => {
  try {
    // Initialize default categories if user has none
    initializeDefaultCategories(req.user!.id)

    const categories = db.prepare(`
      SELECT * FROM categories
      WHERE user_id = ?
      ORDER BY created_at ASC
    `).all(req.user!.id) as Category[]

    res.json({ categories: categories.map(toApiCategory) })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create category
router.post('/', (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body

    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }

    const id = randomUUID()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO categories (id, user_id, name, color, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.user!.id, name, color || null, now)

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category

    res.status(201).json({ category: toApiCategory(category) })
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update category
router.put('/:id', (req: AuthRequest, res) => {
  try {
    const existingCategory = db.prepare(`
      SELECT * FROM categories
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user!.id) as Category | undefined

    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    const { name, color } = req.body

    db.prepare(`
      UPDATE categories SET
        name = ?,
        color = ?
      WHERE id = ? AND user_id = ?
    `).run(
      name ?? existingCategory.name,
      color ?? existingCategory.color,
      req.params.id,
      req.user!.id
    )

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id) as Category

    res.json({ category: toApiCategory(category) })
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete category
router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const result = db.prepare(`
      DELETE FROM categories
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user!.id)

    if (result.changes === 0) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    res.status(204).send()
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
