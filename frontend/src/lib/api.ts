import axios from 'axios'
import type { User, Item, OgpData, Category } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/register', {
      email,
      password,
      name,
    })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  me: async () => {
    const response = await api.get<{ user: User }>('/auth/me')
    return response.data
  },
}

// Items API
export const itemsApi = {
  getAll: async () => {
    const response = await api.get<{ items: Item[] }>('/items')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ item: Item }>(`/items/${id}`)
    return response.data
  },

  create: async (item: Partial<Item>) => {
    const response = await api.post<{ item: Item }>('/items', item)
    return response.data
  },

  update: async (id: string, item: Partial<Item>) => {
    const response = await api.put<{ item: Item }>(`/items/${id}`, item)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/items/${id}`)
  },
}

// OGP API
export const ogpApi = {
  fetch: async (url: string) => {
    const response = await api.post<{ ogp: OgpData }>('/ogp/fetch', { url })
    return response.data
  },
}

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<{ categories: Category[] }>('/categories')
    return response.data
  },

  create: async (category: Partial<Category>) => {
    const response = await api.post<{ category: Category }>('/categories', category)
    return response.data
  },

  update: async (id: string, category: Partial<Category>) => {
    const response = await api.put<{ category: Category }>(`/categories/${id}`, category)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/categories/${id}`)
  },
}

// Share API
export interface PublicWishlist {
  userName: string
  items: Item[]
  categories: Category[]
}

export const shareApi = {
  getToken: async () => {
    const response = await api.get<{ shareToken: string }>('/share/token')
    return response.data
  },

  regenerateToken: async () => {
    const response = await api.post<{ shareToken: string }>('/share/token/regenerate')
    return response.data
  },

  getPublicWishlist: async (token: string) => {
    const response = await api.get<PublicWishlist>(`/share/wishlist/${token}`)
    return response.data
  },
}

export default api
