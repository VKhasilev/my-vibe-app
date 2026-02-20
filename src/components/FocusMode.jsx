import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react'

const POMODORO_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

export default function FocusMode({ tasks, onClose }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // work, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (mode === 'work') {
      setCompletedPomodoros((prev) => prev + 1)
      const nextMode = completedPomodoros + 1 >= 4 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      setTimeLeft(nextMode === 'longBreak' ? LONG_BREAK : SHORT_BREAK)
    } else {
      setMode('work')
      setTimeLeft(POMODORO_DURATION)
      if (mode === 'longBreak') {
        setCompletedPomodoros(0)
      }
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'work') {
      setTimeLeft(POMODORO_DURATION)
    } else if (mode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK)
    } else {
      setTimeLeft(LONG_BREAK)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Focus Mode</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timer Section */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-4">
              <span className="text-slate-300 text-sm font-medium uppercase tracking-wide">
                {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
            
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-7xl font-bold text-white mb-6"
            >
              {formatTime(timeLeft)}
            </motion.div>

            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={mode === 'work' ? '#818cf8' : '#34d399'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 88 * (1 - (mode === 'work' ? progress / 100 : (mode === 'shortBreak' ? (SHORT_BREAK - timeLeft) / SHORT_BREAK : (LONG_BREAK - timeLeft) / LONG_BREAK))),
                  }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className="glass-strong rounded-xl px-6 py-3 text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="glass rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </motion.button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < completedPomodoros ? 'bg-indigo-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Task Selection */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg mb-4">Select a task to focus on:</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-slate-400">No active tasks available</p>
              </div>
            ) : (
              tasks.map((task) => (
                <motion.button
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTask(task.id)}
                  className={`w-full glass rounded-2xl p-4 text-left transition-all ${
                    selectedTask === task.id
                      ? 'ring-2 ring-indigo-400 bg-indigo-500/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className={`mt-0.5 flex-shrink-0 ${
                        selectedTask === task.id ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{task.text}</p>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
