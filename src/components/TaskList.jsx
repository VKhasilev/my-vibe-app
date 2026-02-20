import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onAddTask, onDeleteTask, onToggleComplete, category }) {
  const [newTaskText, setNewTaskText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim())
      setNewTaskText('')
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const incompleteTasks = filteredTasks.filter(t => !t.completed)
  const completedTasks = filteredTasks.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Add Task Form */}
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={`Add a task to ${category}...`}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="glass-strong rounded-xl px-6 py-3 text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add</span>
          </motion.button>
        </div>
      </motion.form>

      {/* Task Lists */}
      <div className="space-y-4">
        {incompleteTasks.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 px-2">
              Active Tasks ({incompleteTasks.length})
            </h3>
            <AnimatePresence>
              {incompleteTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-slate-400 font-semibold mb-3 px-2">
              Completed ({completedTasks.length})
            </h3>
            <AnimatePresence>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <p className="text-slate-400 text-lg">
              {searchQuery ? 'No tasks found matching your search.' : 'No tasks yet. Add one above!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
