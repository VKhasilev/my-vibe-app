import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', labelKey: 'language.en', short: 'EN' },
  { code: 'he', labelKey: 'language.he', short: 'HE' },
]

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const current = i18n.resolvedLanguage || i18n.language

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="language-switcher">
        {t('language.label')}
      </label>
      <motion.select
        id="language-switcher"
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass px-3 py-2 rounded-xl text-white/90 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {LANGS.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900">
            {lang.short} — {t(lang.labelKey)}
          </option>
        ))}
      </motion.select>
    </div>
  )
}

