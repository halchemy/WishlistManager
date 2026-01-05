import type { Item } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useItemsStore } from '@/store/items'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
}

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const { deleteItem, updateItem } = useItemsStore()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(item.id)
    }
  }

  const handleTogglePurchased = async () => {
    await updateItem(item.id, { isPurchased: !item.isPurchased })
  }

  return (
    <Card className={item.isPurchased ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-24 h-24 bg-[hsl(var(--muted))] rounded-md flex-shrink-0 flex items-center justify-center">
              <span className="text-[hsl(var(--muted-foreground))] text-xs">No image</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold truncate ${item.isPurchased ? 'line-through' : ''}`}>
                {item.name}
              </h3>
              {item.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.priority}
                </span>
              )}
            </div>

            {item.siteName && (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {item.siteName}
              </p>
            )}

            {item.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            {item.memo && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 italic">
                Memo: {item.memo}
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
                  View Product
                </a>
              )}
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePurchased}
              >
                {item.isPurchased ? 'Unmark' : 'Purchased'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
