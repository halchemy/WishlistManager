import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
      >
        {currentLanguage.label}
        <span className="text-xs">▼</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-md shadow-lg z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors ${
                lang.code === i18n.language ? 'bg-[hsl(var(--muted))] font-medium' : ''
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
