import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useItemsStore } from '@/store/items'
import { useCategoriesStore } from '@/store/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ItemCard } from '@/components/ItemCard'
import type { Item } from '@/types'

export function DashboardPage() {
  const { t } = useTranslation()
  const { items, isLoading, fetchItems } = useItemsStore()
  const { categories, fetchCategories, addCategory } = useCategoriesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'purchased'>('all')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [fetchItems, fetchCategories])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !item.isPurchased) ||
      (filter === 'purchased' && item.isPurchased)
    const matchesCategory =
      selectedCategoryId === null || item.categoryId === selectedCategoryId
    return matchesSearch && matchesFilter && matchesCategory
  })

  const handleEdit = (_item: Item) => {
    // TODO: Implement edit modal or navigate to edit page
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      await addCategory({ name: newCategoryName.trim() })
      setNewCategoryName('')
      setIsAddingCategory(false)
    } catch {
      // Handle error silently
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
        <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-4">
          <h2 className="font-semibold mb-4">{t('category.title')}</h2>

          <div className="space-y-1">
            {/* All Items */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategoryId === null
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
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
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategoryId === category.id
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'hover:bg-[hsl(var(--muted))]'
                }`}
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
            ))}
          </div>

          {/* Add Category */}
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
            {isAddingCategory ? (
              <div className="space-y-2">
                <Input
                  placeholder={t('category.namePlaceholder')}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory()
                    if (e.key === 'Escape') setIsAddingCategory(false)
                  }}
                  autoFocus
                />
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
                onClick={() => setIsAddingCategory(true)}
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
          <Link to="/items/new">
            <Button>{t('dashboard.addItem')}</Button>
          </Link>
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

        {filteredItems.length === 0 ? (
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
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
