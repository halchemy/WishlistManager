import { Router } from 'express'
import { fetchOgp } from '../services/ogp.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// Fetch OGP data from URL
router.post('/fetch', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      res.status(400).json({ error: 'URL is required' })
      return
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      res.status(400).json({ error: 'Invalid URL' })
      return
    }

    const ogp = await fetchOgp(url)

    res.json({ ogp })
  } catch (error) {
    console.error('OGP fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch OGP data' })
  }
})

export default router
