export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: string
  userId: string
  name: string
  url: string | null
  description: string | null
  siteName: string | null
  memo: string | null
  priority: 'high' | 'medium' | 'low' | null
  isPurchased: boolean
  categoryId: string | null
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  color: string | null
  createdAt: string
}

export interface OgpData {
  title: string | null
  description: string | null
  siteName: string | null
  url: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export interface ItemsState {
  items: Item[]
  isLoading: boolean
  fetchItems: () => Promise<void>
  addItem: (item: Partial<Item>) => Promise<void>
  updateItem: (id: string, item: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}
