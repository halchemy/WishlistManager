import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useItemsStore } from '@/store/items'
import { useCategoriesStore } from '@/store/categories'
import { ogpApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Priority = 'high' | 'medium' | 'low' | null

export function AddItemPage() {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [memo, setMemo] = useState('')
  const [priority, setPriority] = useState<Priority>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')

  const { addItem } = useItemsStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleFetchOgp = async () => {
    if (!url) return

    setIsFetching(true)
    setError('')

    try {
      const { ogp } = await ogpApi.fetch(url)
      if (ogp.title) setName(ogp.title)
      if (ogp.description) setDescription(ogp.description)
    } catch {
      setError(t('addItem.fetchError'))
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setError(t('addItem.nameRequired'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await addItem({
        name,
        url: url || null,
        description: description || null,
        memo: memo || null,
        priority: priority || null,
        categoryId: categoryId || null,
      })
      navigate('/dashboard')
    } catch {
      setError(t('addItem.addError'))
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('addItem.title')}</CardTitle>
          <CardDescription>
            {t('addItem.description')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-pink-600 bg-pink-50 rounded-xl border border-pink-200">
                {error}
              </div>
            )}

            {/* URL Input with Fetch button */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                {t('addItem.productUrl')}
              </label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFetchOgp}
                  disabled={!url || isFetching}
                >
                  {isFetching ? t('addItem.fetching') : t('addItem.fetchInfo')}
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('addItem.name')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                {t('addItem.descriptionLabel')}
              </label>
              <textarea
                id="description"
                placeholder={t('addItem.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-xl border-2 border-[hsl(var(--input))] bg-white px-4 py-2 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-h-[80px] transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                {t('addItem.categoryLabel')}
              </label>
              <select
                id="category"
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
              <label htmlFor="memo" className="text-sm font-medium">
                {t('addItem.memoLabel')}
              </label>
              <textarea
                id="memo"
                placeholder={t('addItem.memoPlaceholder')}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="flex w-full rounded-xl border-2 border-[hsl(var(--input))] bg-white px-4 py-2 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-h-[60px] transition-colors"
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('addItem.adding') : t('addItem.addButton')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              {t('addItem.cancelButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
