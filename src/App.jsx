import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import FocusMode from './components/FocusMode'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [tasks, setTasks] = useLocalStorage('focusflow-tasks', [])
  const [selectedCategory, setSelectedCategory] = useState('Inbox')
  const [showFocusMode, setShowFocusMode] = useState(false)

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory === 'Inbox') return true
    if (selectedCategory === 'High Priority') return task.priority === 'High'
    return task.category === selectedCategory
  })

  const addTask = (taskText) => {
    const priority = determinePriority(taskText)
    const category = selectedCategory === 'Inbox' ? 'Inbox' : selectedCategory
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString()
    }
    
    setTasks([...tasks, newTask])
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const determinePriority = (text) => {
    const lowerText = text.toLowerCase()
    
    // High priority keywords
    const highPriorityKeywords = [
      'urgent', 'asap', 'critical', 'important', 'deadline', 
      'due today', 'emergency', 'fix', 'bug', 'error', 'broken',
      'immediately', 'now', 'today', 'must', 'need to'
    ]
    
    // Low priority keywords
    const lowPriorityKeywords = [
      'someday', 'maybe', 'later', 'eventually', 'optional',
      'nice to have', 'if time', 'low priority', 'when possible'
    ]
    
    if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'High'
    }
    
    if (lowPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'Low'
    }
    
    // Default to Medium
    return 'Medium'
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setShowFocusMode={setShowFocusMode}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">FocusFlow</h1>
            <p className="text-slate-300">Your modern task management companion</p>
          </div>
          
          {showFocusMode ? (
            <FocusMode 
              tasks={filteredTasks.filter(t => !t.completed)}
              onClose={() => setShowFocusMode(false)}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleComplete}
              category={selectedCategory}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
