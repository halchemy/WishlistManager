import { Router } from 'express'
import { randomUUID } from 'crypto'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'
import type { Item, AuthRequest } from '../types/index.js'

const router = Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Helper function to convert DB item to API response
function toApiItem(item: Item) {
  return {
    id: item.id,
    userId: item.user_id,
    name: item.name,
    url: item.url,
    imageUrl: item.image_url,
    description: item.description,
    siteName: item.site_name,
    memo: item.memo,
    priority: item.priority,
    isPurchased: Boolean(item.is_purchased),
    categoryId: item.category_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

// Get all items
router.get('/', (req: AuthRequest, res) => {
  try {
    const items = db.prepare(`
      SELECT * FROM items
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user!.id) as Item[]

    res.json({ items: items.map(toApiItem) })
  } catch (error) {
    console.error('Get items error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single item
router.get('/:id', (req: AuthRequest, res) => {
  try {
    const item = db.prepare(`
      SELECT * FROM items
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user!.id) as Item | undefined

    if (!item) {
      res.status(404).json({ error: 'Item not found' })
      return
    }

    res.json({ item: toApiItem(item) })
  } catch (error) {
    console.error('Get item error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create item
router.post('/', (req: AuthRequest, res) => {
  try {
    const { name, url, imageUrl, description, siteName, memo, priority, categoryId } = req.body

    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }

    const id = randomUUID()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO items (id, user_id, name, url, image_url, description, site_name, memo, priority, category_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user!.id, name, url || null, imageUrl || null, description || null, siteName || null, memo || null, priority || null, categoryId || null, now, now)

    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id) as Item

    res.status(201).json({ item: toApiItem(item) })
  } catch (error) {
    console.error('Create item error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update item
router.put('/:id', (req: AuthRequest, res) => {
  try {
    const existingItem = db.prepare(`
      SELECT * FROM items
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user!.id) as Item | undefined

    if (!existingItem) {
      res.status(404).json({ error: 'Item not found' })
      return
    }

    const { name, url, imageUrl, description, siteName, memo, priority, isPurchased, categoryId } = req.body
    const now = new Date().toISOString()

    db.prepare(`
      UPDATE items SET
        name = ?,
        url = ?,
        image_url = ?,
        description = ?,
        site_name = ?,
        memo = ?,
        priority = ?,
        is_purchased = ?,
        category_id = ?,
        updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(
      name ?? existingItem.name,
      url ?? existingItem.url,
      imageUrl ?? existingItem.image_url,
      description ?? existingItem.description,
      siteName ?? existingItem.site_name,
      memo ?? existingItem.memo,
      priority ?? existingItem.priority,
      isPurchased !== undefined ? (isPurchased ? 1 : 0) : existingItem.is_purchased,
      categoryId ?? existingItem.category_id,
      now,
      req.params.id,
      req.user!.id
    )

    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id) as Item

    res.json({ item: toApiItem(item) })
  } catch (error) {
    console.error('Update item error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete item
router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const result = db.prepare(`
      DELETE FROM items
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user!.id)

    if (result.changes === 0) {
      res.status(404).json({ error: 'Item not found' })
      return
    }

    res.status(204).send()
  } catch (error) {
    console.error('Delete item error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
