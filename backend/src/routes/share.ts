import { Router } from 'express'
import { randomBytes } from 'crypto'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'
import type { User, Item, Category, AuthRequest } from '../types/index.js'

const router = Router()

// Helper function to convert DB item to API response
function toApiItem(item: Item) {
  return {
    id: item.id,
    userId: item.user_id,
    name: item.name,
    url: item.url,
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

// Generate a short, URL-safe token
function generateShareToken(): string {
  return randomBytes(8).toString('base64url')
}

// Get or create share token for current user (requires auth)
router.get('/token', authMiddleware, (req: AuthRequest, res) => {
  try {
    const user = db.prepare('SELECT share_token FROM users WHERE id = ?').get(req.user!.id) as Pick<User, 'share_token'> | undefined

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    let shareToken = user.share_token

    // Generate a new token if user doesn't have one
    if (!shareToken) {
      shareToken = generateShareToken()
      db.prepare('UPDATE users SET share_token = ? WHERE id = ?').run(shareToken, req.user!.id)
    }

    res.json({ shareToken })
  } catch (error) {
    console.error('Get share token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Regenerate share token (requires auth)
router.post('/token/regenerate', authMiddleware, (req: AuthRequest, res) => {
  try {
    const shareToken = generateShareToken()
    db.prepare('UPDATE users SET share_token = ? WHERE id = ?').run(shareToken, req.user!.id)

    res.json({ shareToken })
  } catch (error) {
    console.error('Regenerate share token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get public wishlist by share token (NO auth required)
router.get('/wishlist/:token', (req, res) => {
  try {
    const { token } = req.params

    // Find user by share token
    const user = db.prepare('SELECT id, name FROM users WHERE share_token = ?').get(token) as { id: string; name: string } | undefined

    if (!user) {
      res.status(404).json({ error: 'Wishlist not found' })
      return
    }

    // Get user's items (only non-purchased items for public view)
    const items = db.prepare(`
      SELECT * FROM items
      WHERE user_id = ? AND is_purchased = 0
      ORDER BY created_at DESC
    `).all(user.id) as Item[]

    // Get user's categories
    const categories = db.prepare(`
      SELECT * FROM categories
      WHERE user_id = ?
      ORDER BY created_at ASC
    `).all(user.id) as Category[]

    res.json({
      userName: user.name,
      items: items.map(toApiItem),
      categories: categories.map(toApiCategory),
    })
  } catch (error) {
    console.error('Get public wishlist error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
