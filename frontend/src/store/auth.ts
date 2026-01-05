import { create } from 'zustand'
import type { AuthState } from '@/types'
import { authApi } from '@/lib/api'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { user, token } = await authApi.login(email, password)
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  register: async (email: string, password: string, name: string) => {
    const { user, token } = await authApi.register(email, password, name)
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      const { user } = await authApi.me()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
