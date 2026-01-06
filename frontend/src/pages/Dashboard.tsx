import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useItemsStore } from '@/store/items'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ItemCard } from '@/components/ItemCard'
import type { Item } from '@/types'

export function DashboardPage() {
  const { t } = useTranslation()
  const { items, isLoading, fetchItems } = useItemsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'purchased'>('all')

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !item.isPurchased) ||
      (filter === 'purchased' && item.isPurchased)
    return matchesSearch && matchesFilter
  })

  const handleEdit = (_item: Item) => {
    // TODO: Implement edit modal or navigate to edit page
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div>
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
  )
}
