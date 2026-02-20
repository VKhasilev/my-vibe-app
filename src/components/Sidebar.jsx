import { motion } from 'framer-motion'
import { Inbox, Briefcase, User, AlertCircle, Timer } from 'lucide-react'

const categories = [
  { id: 'Inbox', icon: Inbox, label: 'Inbox' },
  { id: 'Work', icon: Briefcase, label: 'Work' },
  { id: 'Personal', icon: User, label: 'Personal' },
  { id: 'High Priority', icon: AlertCircle, label: 'High Priority' },
]

export default function Sidebar({ selectedCategory, setSelectedCategory, setShowFocusMode }) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 glass-strong rounded-r-2xl p-6 min-h-screen"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">FocusFlow</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
      </div>

      <nav className="space-y-2 mb-8">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = selectedCategory === category.id
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'glass-strong bg-white/30 text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{category.label}</span>
            </motion.button>
          )
        })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowFocusMode(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl glass-strong bg-gradient-to-r from-indigo-500/50 to-purple-500/50 text-white font-medium hover:from-indigo-500/70 hover:to-purple-500/70 transition-all"
      >
        <Timer size={20} />
        <span>Focus Mode</span>
      </motion.button>
    </motion.aside>
  )
}
