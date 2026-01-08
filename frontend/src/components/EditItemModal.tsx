import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useItemsStore } from '@/store/items'
import { useCategoriesStore } from '@/store/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Item } from '@/types'

type Priority = 'high' | 'medium' | 'low' | null

interface EditItemModalProps {
  item: Item
  onClose: () => void
}

export function EditItemModal({ item, onClose }: EditItemModalProps) {
  const { t } = useTranslation()
  const { updateItem } = useItemsStore()
  const { categories } = useCategoriesStore()

  const [url, setUrl] = useState(item.url || '')
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || '')
  const [memo, setMemo] = useState(item.memo || '')
  const [priority, setPriority] = useState<Priority>(item.priority)
  const [categoryId, setCategoryId] = useState<string | null>(item.categoryId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setError(t('addItem.nameRequired'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await updateItem(item.id, {
        name,
        url: url || null,
        description: description || null,
        memo: memo || null,
        priority: priority || null,
        categoryId: categoryId || null,
      })
      onClose()
    } catch {
      setError(t('editItem.updateError'))
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityButtonStyle = (_p: Priority, isSelected: boolean) => {
    if (!isSelected) return 'outline'
    return 'default'
  }

  const getPriorityColorClass = (p: Priority, isSelected: boolean) => {
    if (!isSelected) return ''
    switch (p) {
      case 'high':
        return 'bg-pink-400 hover:bg-pink-500 text-white shadow-md'
      case 'medium':
        return 'bg-amber-400 hover:bg-amber-500 text-white shadow-md'
      case 'low':
        return 'bg-sky-400 hover:bg-sky-500 text-white shadow-md'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[hsl(var(--card))] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border-2 border-[hsl(var(--border))]">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('editItem.title')}</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-pink-600 bg-pink-50 rounded-xl border border-pink-200">
                  {error}
                </div>
              )}

              {/* URL */}
              <div className="space-y-2">
                <label htmlFor="edit-url" className="text-sm font-medium">
                  {t('addItem.productUrl')}
                </label>
                <Input
                  id="edit-url"
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  {t('addItem.name')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  {t('addItem.descriptionLabel')}
                </label>
                <textarea
                  id="edit-description"
                  placeholder={t('addItem.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full rounded-xl border-2 border-[hsl(var(--input))] bg-white px-4 py-2 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-h-[80px] transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  {t('addItem.categoryLabel')}
                </label>
                <select
                  id="edit-category"
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value || null)}
                  className="flex w-full rounded-xl border-2 border-[hsl(var(--input))] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
                >
                  <option value="">{t('addItem.noCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('addItem.priorityLabel')}</label>
                <div className="flex gap-2">
                  {(['high', 'medium', 'low'] as const).map((p) => {
                    const isSelected = priority === p
                    return (
                      <Button
                        key={p}
                        type="button"
                        variant={getPriorityButtonStyle(p, isSelected)}
                        size="sm"
                        className={getPriorityColorClass(p, isSelected)}
                        onClick={() => setPriority(isSelected ? null : p)}
                      >
                        {t(`item.priority.${p}`)}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <label htmlFor="edit-memo" className="text-sm font-medium">
                  {t('addItem.memoLabel')}
                </label>
                <textarea
                  id="edit-memo"
                  placeholder={t('addItem.memoPlaceholder')}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="flex w-full rounded-xl border-2 border-[hsl(var(--input))] bg-white px-4 py-2 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-h-[60px] transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('editItem.updating') : t('editItem.updateButton')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
