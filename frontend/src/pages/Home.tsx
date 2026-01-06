import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'

export function HomePage() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">{t('home.title')}</h1>
      <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-md">
        {t('home.subtitle')}
      </p>

      {isAuthenticated ? (
        <Link to="/dashboard">
          <Button size="lg">{t('home.goToDashboard')}</Button>
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link to="/signup">
            <Button size="lg">{t('home.getStarted')}</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              {t('header.login')}
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">{t('home.feature1Title')}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('home.feature1Desc')}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">{t('home.feature2Title')}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('home.feature2Desc')}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">{t('home.feature3Title')}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('home.feature3Desc')}
          </p>
        </div>
      </div>
    </div>
  )
}
