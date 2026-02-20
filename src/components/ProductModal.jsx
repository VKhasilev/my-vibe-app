import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCategories } from '../hooks/useSupabaseData'

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [addedToCart, setAddedToCart] = useState(false)
  const { t, i18n } = useTranslation()
  const { categories } = useCategories()

  if (!product) return null

  const isRTL = i18n.dir() === 'rtl'
  const name = i18n.language === 'he' ? (product.name_he || product.name_en) : (product.name_en || product.name_he)
  const description = i18n.language === 'he' 
    ? (product.description_he || product.description_en || '')
    : (product.description_en || product.description_he || '')
  const category = product.categoryId ? categories.find(cat => cat.id === product.categoryId) : null
  const categoryName = category 
    ? (i18n.language === 'he' ? category.name_he : category.name_en)
    : null
  
  // Parse features from specs JSON if available
  let features = []
  if (product.specs && typeof product.specs === 'object') {
    features = Object.entries(product.specs).map(([key, value]) => `${key}: ${value}`)
  }

  const handleAddToCart = () => {
    onAddToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-96 md:h-full min-h-[400px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <img
                    src={product.image || product.image_url}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/600x600/6366f1/ffffff?text=${encodeURIComponent(name.substring(0, 15))}`
                    }}
                  />
                  <button
                    onClick={onClose}
                    className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-xl glass-strong hover:bg-white/30 transition-colors`}
                    aria-label={t('product.closeModalAria')}
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col">
                  {categoryName && (
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">
                        {categoryName}
                      </span>
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {name}
                  </h2>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {description}
                  </p>

                  {/* Features/Specs */}
                  {features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-3">{t('product.featuresTitle')}</h3>
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-white/70">
                            <Check size={18} className="text-indigo-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="mt-auto pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-white/60 text-sm">{t('product.priceLabel')}</span>
                        <p className="text-4xl font-bold text-white">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                        addedToCart
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                      } flex items-center justify-center gap-2 shadow-lg`}
                    >
                      {addedToCart ? (
                        <>
                          <Check size={20} />
                          {t('product.addedToCart')}
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          {t('product.addToCart')}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
