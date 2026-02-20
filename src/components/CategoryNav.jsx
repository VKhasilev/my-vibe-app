import { motion } from 'framer-motion'
import { categories } from '../data/products'

export default function CategoryNav({ selectedCategory, onCategoryChange }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              selectedCategory === category
                ? 'glass-strong bg-white/30 text-white shadow-lg'
                : 'glass text-white/80 hover:bg-white/20'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
