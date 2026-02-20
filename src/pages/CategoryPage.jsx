import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCatalog from '../components/ProductCatalog'
import CategoryNav from '../components/CategoryNav'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { useProducts, useCategories, useSubcategories } from '../hooks/useSupabaseData'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function CategoryPage({ onAddToCart, onProductClick }) {
  const { categoryId, subcategoryId } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.dir() === 'rtl'
  const { products: filteredProducts, loading } = useProducts({ categoryId, subcategoryId })
  const { categories } = useCategories()
  const { subcategories } = useSubcategories(categoryId)

  const category = categoryId ? categories.find(cat => cat.id === categoryId) : null
  const categoryName = category 
    ? (i18n.language === 'he' ? category.name_he : category.name_en)
    : null
  
  const subcategory = subcategoryId ? subcategories.find(sub => sub.id === subcategoryId) : null
  const subcategoryName = subcategory
    ? (i18n.language === 'he' ? subcategory.name_he : subcategory.name_en)
    : null

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-white/60">
          <button
            onClick={() => navigate('/')}
            className="hover:text-white transition-colors"
          >
            {t('categories.all')}
          </button>
          {category && (
            <>
              <ChevronIcon size={16} />
              <span className="text-white font-semibold">
                {categoryName}
              </span>
            </>
          )}
          {subcategory && (
            <>
              <ChevronIcon size={16} />
              <span className="text-white font-semibold">
                {subcategoryName}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold text-white mb-2">
          {subcategoryName || categoryName || t('app.heroTitle')}
        </h2>
        <p className="text-slate-300">
          {loading ? '...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
        </p>
      </motion.div>

      <CategoryNav />

      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts.length > 0 ? (
        <ProductCatalog
          products={filteredProducts}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-white/60 text-lg">No products found in this category.</p>
        </div>
      )}
    </>
  )
}
