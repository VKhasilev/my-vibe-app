import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

export default function ProductCatalog({ products, onAddToCart, onProductClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        </motion.div>
      ))}
    </div>
  )
}
