import type { Request } from 'express'

export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  share_token: string | null
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  user_id: string
  name: string
  url: string | null
  description: string | null
  site_name: string | null
  memo: string | null
  priority: string | null
  is_purchased: number
  category_id: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string | null
  created_at: string
}

export interface JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  user?: { id: string }
}
