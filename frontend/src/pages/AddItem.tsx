import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItemsStore } from '@/store/items'
import { ogpApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Priority = 'high' | 'medium' | 'low' | null

export function AddItemPage() {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [siteName, setSiteName] = useState('')
  const [memo, setMemo] = useState('')
  const [priority, setPriority] = useState<Priority>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')

  const { addItem } = useItemsStore()
  const navigate = useNavigate()

  const handleFetchOgp = async () => {
    if (!url) return

    setIsFetching(true)
    setError('')

    try {
      const { ogp } = await ogpApi.fetch(url)
      if (ogp.title) setName(ogp.title)
      if (ogp.description) setDescription(ogp.description)
      if (ogp.image) setImageUrl(ogp.image)
      if (ogp.siteName) setSiteName(ogp.siteName)
    } catch (err) {
      setError('Failed to fetch page info. You can enter details manually.')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setError('Name is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await addItem({
        name,
        url: url || null,
        imageUrl: imageUrl || null,
        description: description || null,
        siteName: siteName || null,
        memo: memo || null,
        priority: priority || null,
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to add item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>
            Enter a URL to auto-fill product info, or add details manually.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* URL Input with Fetch button */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Product URL
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
                  {isFetching ? 'Fetching...' : 'Fetch Info'}
                </Button>
              </div>
            </div>

            {/* Preview if image exists */}
            {imageUrl && (
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="max-h-48 rounded-md object-contain"
                  onError={() => setImageUrl('')}
                />
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Site Name */}
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium">
                Site Name
              </label>
              <Input
                id="siteName"
                type="text"
                placeholder="e.g., Amazon, Rakuten"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm ring-offset-[hsl(var(--background))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 min-h-[80px]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={priority === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriority(priority === p ? null : p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <label htmlFor="memo" className="text-sm font-medium">
                Memo
              </label>
              <textarea
                id="memo"
                placeholder="Your notes..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="flex w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm ring-offset-[hsl(var(--background))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 min-h-[60px]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Item'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
