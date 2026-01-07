import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <header className="border-b-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[hsl(var(--primary))] hover:scale-105 transition-transform">
          {t('header.title')}
        </Link>

        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('header.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('header.login')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t('header.signup')}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
