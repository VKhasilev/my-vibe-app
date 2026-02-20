import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ExitPage({ onReturn }) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl max-w-md w-full p-8 text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-blue-500/30">
            <Shield size={40} className="text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('exit.title')}
        </h2>

        {/* Message */}
        <p className="text-white/80 mb-8 leading-relaxed">
          {t('exit.message')}
        </p>

        {/* Button */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReturn}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isRTL ? (
              <span className="inline-flex items-center">
                <ArrowLeft size={20} className="rotate-180" />
              </span>
            ) : (
              <ArrowLeft size={20} />
            )}
            {t('exit.return')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
