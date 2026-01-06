import { create } from 'zustand'
import type { CategoriesState } from '@/types'
import { categoriesApi } from '@/lib/api'

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true })
    try {
      const { categories } = await categoriesApi.getAll()
      set({ categories, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addCategory: async (category) => {
    const { category: newCategory } = await categoriesApi.create(category)
    set({ categories: [...get().categories, newCategory] })
  },

  updateCategory: async (id, category) => {
    const { category: updatedCategory } = await categoriesApi.update(id, category)
    set({
      categories: get().categories.map((c) => (c.id === id ? updatedCategory : c)),
    })
  },

  deleteCategory: async (id) => {
    await categoriesApi.delete(id)
    set({ categories: get().categories.filter((c) => c.id !== id) })
  },
}))
