import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, User } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import Checkout from './components/Checkout'
import AgeVerification from './components/AgeVerification'
import ExitPage from './components/ExitPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import AdminAddProductPage from './pages/AdminAddProductPage'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const location = useLocation()

  const [cartItems, setCartItems] = useLocalStorage('vibeshop-cart', [])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [hasExited, setHasExited] = useState(false)

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleCheckoutComplete = () => {
    setCartItems([])
    setIsCheckoutOpen(false)
    setIsCartOpen(false)
    alert(t('checkout.successAlert'))
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Show exit page if user chose to exit
  if (hasExited) {
    return (
      <ExitPage
        onReturn={() => {
          setHasExited(false)
          localStorage.removeItem('vibeshop-age-verified')
        }}
      />
    )
  }

  // Show age verification if not verified yet
  if (!isAgeVerified) {
    return (
      <AgeVerification
        onVerified={() => setIsAgeVerified(true)}
        onExit={() => setHasExited(true)}
      />
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass-strong border-b border-white/20 sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{t('app.brand')}</h1>
                  <p className="text-xs text-white/60">{t('app.tagline')}</p>
                </div>
              </motion.div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl glass hover:bg-white/20 transition-colors"
                  aria-label={t('app.profileAria')}
                >
                  <User size={24} className="text-white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-xl glass hover:bg-white/20 transition-colors"
                  aria-label={t('app.cartAria')}
                >
                  <ShoppingCart size={24} className="text-white" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    onAddToCart={addToCart}
                    onProductClick={handleProductClick}
                  />
                } 
              />
              <Route 
                path="/category/:categoryId" 
                element={
                  <CategoryPage 
                    onAddToCart={addToCart}
                    onProductClick={handleProductClick}
                  />
                } 
              />
              <Route 
                path="/category/:categoryId/:subcategoryId" 
                element={
                  <CategoryPage 
                    onAddToCart={addToCart}
                    onProductClick={handleProductClick}
                  />
                } 
              />
              <Route 
                path="/admin/add-product" 
                element={<AdminAddProductPage />} 
              />
            </Routes>
          </div>
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={addToCart}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onComplete={handleCheckoutComplete}
      />
    </div>
  )
}

export default App
