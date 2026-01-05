import { create } from 'zustand'
import type { ItemsState } from '@/types'
import { itemsApi } from '@/lib/api'

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true })
    try {
      const { items } = await itemsApi.getAll()
      set({ items, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addItem: async (item) => {
    const { item: newItem } = await itemsApi.create(item)
    set({ items: [newItem, ...get().items] })
  },

  updateItem: async (id, item) => {
    const { item: updatedItem } = await itemsApi.update(id, item)
    set({
      items: get().items.map((i) => (i.id === id ? updatedItem : i)),
    })
  },

  deleteItem: async (id) => {
    await itemsApi.delete(id)
    set({ items: get().items.filter((i) => i.id !== id) })
  },
}))
