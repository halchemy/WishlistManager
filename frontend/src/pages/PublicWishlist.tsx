import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { shareApi, type PublicWishlist } from '@/lib/api'
import type { Item, Category } from '@/types'

export function PublicWishlistPage() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setError(true)
        setIsLoading(false)
        return
      }

      try {
        const data = await shareApi.getPublicWishlist(token)
        setWishlist(data)
      } catch {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [token])

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

  const getCategoryById = (categoryId: string | null): Category | undefined => {
    if (!categoryId || !wishlist) return undefined
    return wishlist.categories.find(c => c.id === categoryId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[hsl(var(--muted-foreground))]">{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !wishlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold mb-2">{t('share.notFound')}</h1>
        <p className="text-[hsl(var(--muted-foreground))]">{t('share.notFoundDesc')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {wishlist.userName}{t('share.publicTitle')}
      </h1>

      {wishlist.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--muted-foreground))]">
            {t('dashboard.noItems')}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {wishlist.items.map((item: Item) => {
            const category = getCategoryById(item.categoryId)
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
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
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      {item.description}
                    </p>
                  )}

                  {item.url && (
                    <div className="mt-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[hsl(var(--primary))] hover:underline"
                      >
                        {t('item.viewProduct')}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
