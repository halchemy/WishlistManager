import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { shareApi } from '@/lib/api'

interface ShareModalProps {
  onClose: () => void
}

export function ShareModal({ onClose }: ShareModalProps) {
  const { t } = useTranslation()
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { shareToken } = await shareApi.getToken()
        setShareToken(shareToken)
      } catch (error) {
        console.error('Failed to fetch share token:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchToken()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const shareUrl = shareToken ? `${window.location.origin}/wishlist/${shareToken}` : ''

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleRegenerate = async () => {
    setIsLoading(true)
    try {
      const { shareToken } = await shareApi.regenerateToken()
      setShareToken(shareToken)
    } catch (error) {
      console.error('Failed to regenerate token:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareText = t('share.shareText')

  const snsLinks = [
    {
      name: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black hover:bg-gray-800',
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    },
    {
      name: 'LINE',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
      getUrl: () => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#00B900] hover:bg-[#00A000]',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[hsl(var(--card))] rounded-2xl shadow-xl w-full max-w-md mx-4 border-2 border-[hsl(var(--border))]">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('share.title')}</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[hsl(var(--muted-foreground))]">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Share URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('share.linkLabel')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 text-sm bg-[hsl(var(--muted))] rounded-xl border-2 border-[hsl(var(--border))] focus:outline-none"
                  />
                  <Button onClick={handleCopy} variant="secondary">
                    {copied ? t('share.copied') : t('share.copy')}
                  </Button>
                </div>
              </div>

              {/* SNS Share Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('share.shareOn')}</label>
                <div className="flex gap-2">
                  {snsLinks.map((sns) => (
                    <a
                      key={sns.name}
                      href={sns.getUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-transform hover:scale-110 ${sns.color}`}
                      title={sns.name}
                    >
                      {sns.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Regenerate Link */}
              <div className="pt-4 border-t border-[hsl(var(--border))]">
                <button
                  onClick={handleRegenerate}
                  className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                >
                  {t('share.regenerate')}
                </button>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {t('share.regenerateNote')}
                </p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
