import { useTranslation } from 'react-i18next'
import type { Item } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useItemsStore } from '@/store/items'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
}

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const { t } = useTranslation()
  const { deleteItem, updateItem } = useItemsStore()

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
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
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
              {item.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getPriorityStyle(item.priority)}`}
                >
                  {getPriorityLabel(item.priority)}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            {item.memo && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 italic">
                {t('item.memo')}: {item.memo}
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
