import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCatalog from '../components/ProductCatalog'
import CategoryNav from '../components/CategoryNav'
import { products } from '../data/products'
import { getCategoryById, getSubcategoryByIds } from '../data/categories.js'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function CategoryPage({ onAddToCart, onProductClick }) {
  const { categoryId, subcategoryId } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.dir() === 'rtl'

  const category = categoryId ? getCategoryById(categoryId) : null
  const subcategory = categoryId && subcategoryId 
    ? getSubcategoryByIds(categoryId, subcategoryId) 
    : null

  // Filter products by category/subcategory
  let filteredProducts = products

  if (categoryId) {
    filteredProducts = products.filter(product => {
      // Match main category
      if (product.categoryId === categoryId) {
        // If subcategory is specified, filter by it
        if (subcategoryId) {
          return product.subcategoryId === subcategoryId
        }
        return true
      }
      return false
    })
  }

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
                {t(category.titleKey)}
              </span>
            </>
          )}
          {subcategory && (
            <>
              <ChevronIcon size={16} />
              <span className="text-white font-semibold">
                {t(subcategory.titleKey)}
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
          {subcategory 
            ? t(subcategory.titleKey)
            : category 
            ? t(category.titleKey)
            : t('app.heroTitle')
          }
        </h2>
        <p className="text-slate-300">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </motion.div>

      <CategoryNav />

      {filteredProducts.length > 0 ? (
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
