import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useItemsStore } from '@/store/items'
import { useCategoriesStore } from '@/store/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ItemCard } from '@/components/ItemCard'
import { EditItemModal } from '@/components/EditItemModal'
import { ShareModal } from '@/components/ShareModal'
import type { Item } from '@/types'

type SortOption = 'newest' | 'oldest' | 'priority'

// Generate random color using HSL for vivid colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 55%)`
}

// Convert HSL to Hex for color input
const hslToHex = (hsl: string): string => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (!match) return hsl.startsWith('#') ? hsl : '#EC4899'

  const h = parseInt(match[1]) / 360
  const s = parseInt(match[2]) / 100
  const l = parseInt(match[3]) / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255)
  const g = Math.round(hue2rgb(p, q, h) * 255)
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { items, isLoading, fetchItems } = useItemsStore()
  const { categories, fetchCategories, addCategory, deleteCategory } = useCategoriesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'purchased'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(getRandomColor())
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [fetchItems, fetchCategories])

  const getPriorityValue = (priority: string | null): number => {
    switch (priority) {
      case 'high':
        return 3
      case 'medium':
        return 2
      case 'low':
        return 1
      default:
        return 0
    }
  }

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !item.isPurchased) ||
        (filter === 'purchased' && item.isPurchased)
      const matchesCategory =
        selectedCategoryId === null || item.categoryId === selectedCategoryId
      return matchesSearch && matchesFilter && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return getPriorityValue(b.priority) - getPriorityValue(a.priority)
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleEdit = (item: Item) => {
    setEditingItem(item)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      await addCategory({ name: newCategoryName.trim(), color: newCategoryColor })
      setNewCategoryName('')
      setNewCategoryColor(getRandomColor())
      setIsAddingCategory(false)
    } catch {
      // Handle error silently
    }
  }

  const handleStartAddCategory = () => {
    setNewCategoryColor(getRandomColor())
    setIsAddingCategory(true)
  }

  const handleDeleteCategory = async (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(t('category.confirmDelete'))) {
      try {
        await deleteCategory(categoryId)
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null)
        }
      } catch {
        // Handle error silently
      }
    }
  }

  const getItemCountForCategory = (categoryId: string | null) => {
    if (categoryId === null) {
      return items.length
    }
    return items.filter((item) => item.categoryId === categoryId).length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Category Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-[hsl(var(--card))] rounded-2xl border-2 border-[hsl(var(--border))] p-4 shadow-md">
          <h2 className="font-semibold mb-4">{t('category.title')}</h2>

          <div className="space-y-1">
            {/* All Items */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategoryId === null
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                  : 'hover:bg-[hsl(var(--muted))]'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{t('category.all')}</span>
                <span className="text-xs opacity-70">({getItemCountForCategory(null)})</span>
              </span>
            </button>

            {/* Category List */}
            {categories.map((category) => (
              <div
                key={category.id}
                className={`group flex items-center rounded-xl text-sm font-medium transition-all ${
                  selectedCategoryId === category.id
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                    : 'hover:bg-[hsl(var(--muted))]'
                }`}
              >
                <button
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="flex-1 text-left px-3 py-2"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {category.color && (
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span className="truncate">{category.name}</span>
                    </span>
                    <span className="text-xs opacity-70">({getItemCountForCategory(category.id)})</span>
                  </span>
                </button>
                <button
                  onClick={(e) => handleDeleteCategory(category.id, e)}
                  className={`px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ${
                    selectedCategoryId === category.id ? 'text-[hsl(var(--primary-foreground))]' : ''
                  }`}
                  title={t('common.delete')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Category */}
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
            {isAddingCategory ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="relative cursor-pointer">
                    <span
                      className="block w-6 h-6 rounded-full flex-shrink-0 border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: newCategoryColor }}
                    />
                    <input
                      type="color"
                      value={hslToHex(newCategoryColor)}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  <Input
                    placeholder={t('category.namePlaceholder')}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCategory()
                      if (e.key === 'Escape') {
                        setIsAddingCategory(false)
                        setNewCategoryName('')
                      }
                    }}
                    autoFocus
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCategory}>
                    {t('category.add')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingCategory(false)
                      setNewCategoryName('')
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleStartAddCategory}
              >
                + {t('category.addNew')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowShareModal(true)}>
              {t('share.button')}
            </Button>
            <Link to="/items/new">
              <Button>{t('dashboard.addItem')}</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder={t('dashboard.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {t('dashboard.filterAll')} ({items.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              {t('dashboard.filterActive')} ({items.filter((i) => !i.isPurchased).length})
            </Button>
            <Button
              variant={filter === 'purchased' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('purchased')}
            >
              {t('dashboard.filterPurchased')} ({items.filter((i) => i.isPurchased).length})
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-[hsl(var(--muted-foreground))]">{t('dashboard.sortBy')}:</span>
          <div className="flex gap-1">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              {t('dashboard.sortNewest')}
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('oldest')}
            >
              {t('dashboard.sortOldest')}
            </Button>
            <Button
              variant={sortBy === 'priority' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('priority')}
            >
              {t('dashboard.sortPriority')}
            </Button>
          </div>
        </div>

        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[hsl(var(--muted-foreground))] mb-4">
              {items.length === 0
                ? t('dashboard.noItems')
                : t('dashboard.noSearchResults')}
            </p>
            {items.length === 0 && (
              <Link to="/items/new">
                <Button>{t('dashboard.addFirstItem')}</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedItems.map((item) => (
              <ItemCard key={item.id} item={item} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  )
}
