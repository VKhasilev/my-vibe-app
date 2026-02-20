import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getCategoryById } from '../data/categories.js'

export default function ProductCard({ product, onAddToCart, onProductClick }) {
  const { t } = useTranslation()
  const name = t(product.nameKey)
  const category = product.categoryId ? getCategoryById(product.categoryId) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass rounded-3xl overflow-hidden cursor-pointer group"
      onClick={() => onProductClick(product)}
    >
      <div className="relative h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(name)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6">
        {category && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
              {t(category.titleKey)}
            </span>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product)
            }}
            className="glass-strong p-3 rounded-xl text-white hover:bg-white/30 transition-colors"
            aria-label={t('product.addToCartAria')}
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
