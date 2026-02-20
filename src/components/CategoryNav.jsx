import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCategories } from '../hooks/useSupabaseData'

export default function CategoryNav() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { categories, loading } = useCategories()

  const isActive = (categoryId) => {
    return location.pathname === `/category/${categoryId}` || 
           location.pathname.startsWith(`/category/${categoryId}/`)
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
            location.pathname === '/'
              ? 'glass-strong bg-white/30 text-white shadow-lg'
              : 'glass text-white/80 hover:bg-white/20'
          }`}
        >
          {t('categories.all')}
        </motion.button>

        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-32 bg-white/10 rounded-2xl animate-pulse" />
            ))}
          </>
        ) : (
          categories.map((category) => {
            const categoryName = i18n.language === 'he' ? category.name_he : category.name_en
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all truncate max-w-xs ${
                  isActive(category.id)
                    ? 'glass-strong bg-white/30 text-white shadow-lg'
                    : 'glass text-white/80 hover:bg-white/20'
                }`}
                title={categoryName}
              >
                {categoryName}
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}
