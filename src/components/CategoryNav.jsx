import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { categories } from '../data/categories.js'

export default function CategoryNav() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

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

        {categories.map((category) => (
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
            title={t(category.titleKey)}
          >
            {t(category.titleKey)}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
