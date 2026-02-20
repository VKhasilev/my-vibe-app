import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function AgeVerification({ onVerified, onExit }) {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Check if user has already verified their age
    const ageVerified = localStorage.getItem('vibeshop-age-verified')
    if (!ageVerified) {
      setIsVisible(true)
    } else {
      onVerified()
    }
  }, [onVerified])

  const handleEnter = () => {
    localStorage.setItem('vibeshop-age-verified', 'true')
    setIsVisible(false)
    setTimeout(() => {
      onVerified()
    }, 300)
  }

  const handleExit = () => {
    setIsVisible(false)
    setTimeout(() => {
      onExit()
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-strong rounded-3xl max-w-md w-full p-8 shadow-2xl"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border-2 border-orange-500/30">
                  <AlertTriangle size={40} className="text-orange-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-4">
                {t('age.title')}
              </h2>

              {/* Subtitle */}
              <p className="text-xl font-semibold text-white/90 text-center mb-6">
                {t('age.welcome')}
              </p>

              {/* Description */}
              <p className="text-white/70 text-center mb-8 leading-relaxed">
                {t('age.description')}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnter}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
                >
                  {t('age.enter')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExit}
                  className="w-full py-4 rounded-2xl glass text-white/80 font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  {t('age.exit')}
                </motion.button>
              </div>

              {/* Warning Text */}
              <p className="text-xs text-white/50 text-center mt-6">
                {t('age.warning')}
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
