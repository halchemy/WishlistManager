import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import itemsRoutes from './routes/items.js'
import ogpRoutes from './routes/ogp.js'
import categoriesRoutes from './routes/categories.js'
import shareRoutes from './routes/share.js'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/items', itemsRoutes)
app.use('/api/ogp', ogpRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/share', shareRoutes)

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
