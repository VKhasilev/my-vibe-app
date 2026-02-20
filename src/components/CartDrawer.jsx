import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 h-full w-full max-w-md glass-strong z-50 shadow-2xl flex flex-col ${isRTL ? 'left-0' : 'right-0'}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">
                  {t('cart.title')} ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                aria-label={t('cart.closeAria')}
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-white/30 mb-4" />
                  <p className="text-white/60 text-lg">{t('cart.emptyTitle')}</p>
                  <p className="text-white/40 text-sm mt-2">{t('cart.emptySubtitle')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const name = item.name_en || item.name_he || item.name || 'Product'
                    const imageUrl = item.image || item.image_url

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-2xl p-4"
                      >
                        <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/80x80/6366f1/ffffff?text=${encodeURIComponent(name.substring(0, 2))}`
                            }}
                          />
                        </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold mb-1 truncate">
                              {name}
                            </h3>
                            <p className="text-white/60 text-sm mb-3">
                              {t('app.currencyEach', { price: `$${item.price.toFixed(2)}` })}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 rounded-lg glass-strong hover:bg-white/30 transition-colors"
                                  aria-label={t('cart.decreaseQtyAria')}
                                >
                                  <Minus size={16} className="text-white" />
                                </button>
                                <span className="text-white font-semibold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1.5 rounded-lg glass-strong hover:bg-white/30 transition-colors"
                                  aria-label={t('cart.increaseQtyAria')}
                                >
                                  <Plus size={16} className="text-white" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="p-1.5 rounded-lg glass-strong hover:bg-red-500/30 transition-colors"
                                  aria-label={t('cart.removeItemAria')}
                                >
                                  <Trash2 size={16} className="text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/20 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-white/80 font-medium">{t('cart.totalLabel')}</span>
                  <span className="text-3xl font-bold text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
                >
                  {t('cart.checkoutCta')}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
