import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ProductCatalog from '../components/ProductCatalog'
import CategoryNav from '../components/CategoryNav'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { useProducts } from '../hooks/useSupabaseData'

export default function HomePage({ onAddToCart, onProductClick }) {
  const { t } = useTranslation()
  const { products, loading } = useProducts()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold text-white mb-2">{t('app.heroTitle')}</h2>
        <p className="text-slate-300">{t('app.heroSubtitle')}</p>
      </motion.div>

      <CategoryNav />

      {loading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductCatalog
          products={products}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      )}
    </>
  )
}
