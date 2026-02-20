import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import he from './locales/he.json'

const SUPPORTED_LANGS = ['en', 'he']
const LANG_STORAGE_KEY = 'vibeshop-lang'

function normalizeLanguage(lang) {
  if (!lang) return 'en'
  const lower = String(lang).toLowerCase()
  if (lower.startsWith('he')) return 'he'
  if (lower.startsWith('en')) return 'en'
  return 'en'
}

function applyDocumentDirection(lang) {
  if (typeof document === 'undefined') return
  const normalized = normalizeLanguage(lang)
  const dir = normalized === 'he' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('lang', normalized)
  document.documentElement.setAttribute('dir', dir)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    supportedLngs: SUPPORTED_LANGS,
    fallbackLng: 'en',
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
      checkWhitelist: true,
    },
    react: {
      useSuspense: false,
    },
  })

applyDocumentDirection(i18n.language)
i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng)
})

export { LANG_STORAGE_KEY, SUPPORTED_LANGS }
export default i18n

