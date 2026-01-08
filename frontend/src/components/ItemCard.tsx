import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Item } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useItemsStore } from '@/store/items'
import { useCategoriesStore } from '@/store/categories'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
}

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const { t } = useTranslation()
  const { deleteItem, updateItem } = useItemsStore()
  const { categories } = useCategoriesStore()
  const [showMemo, setShowMemo] = useState(false)

  const category = item.categoryId
    ? categories.find(c => c.id === item.categoryId)
    : null

  const handleDelete = async () => {
    if (window.confirm(t('item.confirmDelete'))) {
      await deleteItem(item.id)
    }
  }

  const handleTogglePurchased = async () => {
    await updateItem(item.id, { isPurchased: !item.isPurchased })
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-pink-100 text-pink-600 border border-pink-200'
      case 'medium':
        return 'bg-amber-100 text-amber-600 border border-amber-200'
      case 'low':
        return 'bg-sky-100 text-sky-600 border border-sky-200'
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return t('item.priority.high')
      case 'medium':
        return t('item.priority.medium')
      case 'low':
        return t('item.priority.low')
      default:
        return priority
    }
  }

  return (
    <Card className={item.isPurchased ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold truncate ${item.isPurchased ? 'line-through' : ''}`}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {category?.color && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                    title={category.name}
                  />
                )}
                {item.priority && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityStyle(item.priority)}`}
                  >
                    {getPriorityLabel(item.priority)}
                  </span>
                )}
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[hsl(var(--primary))] hover:underline"
                >
                  {t('item.viewProduct')}
                </a>
              )}
              {item.memo && (
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowMemo(true)}
                    onMouseLeave={() => setShowMemo(false)}
                    onFocus={() => setShowMemo(true)}
                    onBlur={() => setShowMemo(false)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors p-1"
                    aria-label={t('item.memo')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  </button>
                  {showMemo && (
                    <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 bg-[hsl(var(--card))] border-2 border-[hsl(var(--border))] rounded-xl shadow-lg">
                      <p className="text-xs font-medium text-[hsl(var(--primary))] mb-1">{t('item.memo')}</p>
                      <p className="text-sm text-[hsl(var(--foreground))]">{item.memo}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePurchased}
              >
                {item.isPurchased ? t('item.unmark') : t('item.markPurchased')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                {t('common.edit')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                {t('common.delete')}
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
