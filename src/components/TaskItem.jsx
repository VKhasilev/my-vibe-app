import { motion } from 'framer-motion'
import { Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

const priorityColors = {
  High: 'border-red-400/50 bg-red-500/10',
  Medium: 'border-yellow-400/50 bg-yellow-500/10',
  Low: 'border-blue-400/50 bg-blue-500/10',
}

const priorityIcons = {
  High: AlertCircle,
  Medium: AlertCircle,
  Low: AlertCircle,
}

export default function TaskItem({ task, onDelete, onToggleComplete }) {
  const PriorityIcon = priorityIcons[task.priority]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      layout
      className={`glass rounded-2xl p-4 mb-3 border-l-4 ${priorityColors[task.priority]} ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="text-green-400" size={24} />
          ) : (
            <Circle className="text-slate-400" size={24} />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-white ${
              task.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.text}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${priorityColors[task.priority]}`}>
              <PriorityIcon
                size={12}
                className={
                  task.priority === 'High'
                    ? 'text-red-400'
                    : task.priority === 'Medium'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }
              />
              <span
                className={`text-xs font-medium ${
                  task.priority === 'High'
                    ? 'text-red-300'
                    : task.priority === 'Medium'
                    ? 'text-yellow-300'
                    : 'text-blue-300'
                }`}
              >
                {task.priority}
              </span>
            </div>
            {task.category && task.category !== 'Inbox' && (
              <span className="text-xs text-slate-400 px-2 py-1 rounded-lg bg-white/5">
                {task.category}
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-slate-400 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={18} />
        </motion.button>
      </div>
    </motion.div>
  )
}
