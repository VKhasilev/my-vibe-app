import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCategories, useSubcategories } from '../hooks/useSupabaseData'

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isRTL = i18n.dir() === 'rtl'
  const { categories, loading } = useCategories()
  
  // Get active category ID for subcategories
  const activeCategoryId = categories.find(cat => 
    location.pathname === `/category/${cat.id}` || 
    location.pathname.startsWith(`/category/${cat.id}/`)
  )?.id
  
  const { subcategories: activeSubcategories } = useSubcategories(activeCategoryId)

  const isActive = (categoryId) => {
    return location.pathname === `/category/${categoryId}` || 
           location.pathname.startsWith(`/category/${categoryId}/`)
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`)
  }

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    navigate(`/category/${categoryId}/${subcategoryId}`)
  }

  return (
    <motion.aside
      initial={{ x: isRTL ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 glass-strong rounded-r-2xl p-6 min-h-screen sticky top-0"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">VibeShop</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
      </div>

      <nav className="space-y-2">
        {/* All Products Link */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
            location.pathname === '/'
              ? 'glass-strong bg-white/30 text-white'
              : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <span className="font-medium">{t('categories.all')}</span>
        </motion.button>

        {/* Categories */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const Icon = category.icon
            const active = isActive(category.id)
            const categoryName = i18n.language === 'he' ? category.name_he : category.name_en
            
            return (
              <div key={category.id} className="space-y-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                    active
                      ? 'glass-strong bg-white/30 text-white'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium truncate">{categoryName}</span>
                </motion.button>

                {/* Subcategories */}
                {active && category.id === activeCategoryId && activeSubcategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ml-8 space-y-1"
                  >
                    {activeSubcategories.map((subcategory) => {
                      const subActive = location.pathname === `/category/${category.id}/${subcategory.id}`
                      const subcategoryName = i18n.language === 'he' ? subcategory.name_he : subcategory.name_en
                      return (
                        <motion.button
                          key={subcategory.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                          className={`w-full px-4 py-2 rounded-xl transition-all text-left text-sm ${
                            subActive
                              ? 'bg-white/20 text-white'
                              : 'text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {subcategoryName}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </div>
            )
          })
        )}
      </nav>
    </motion.aside>
  )
}
