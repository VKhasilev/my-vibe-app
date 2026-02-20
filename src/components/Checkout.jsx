import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function Checkout({ isOpen, onClose, cartItems, onComplete }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Complete checkout
      onComplete()
      onClose()
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const isStep1Valid = formData.fullName && formData.email && formData.address && formData.city && formData.zipCode && formData.country
  const isStep2Valid = formData.cardNumber && formData.cardName && formData.expiryDate && formData.cvv

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Checkout</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                  aria-label="Close checkout"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-indigo-500' : 'bg-white/20'
                    }`}>
                      {step > 1 ? <CheckCircle size={20} className="text-white" /> : <Truck size={20} className="text-white" />}
                    </div>
                    <span className={`font-medium ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
                      Shipping
                    </span>
                  </div>
                  <div className="flex-1 h-1 mx-4 bg-white/20">
                    <div className={`h-full transition-all ${step >= 2 ? 'bg-indigo-500' : 'bg-white/20'}`} style={{ width: step >= 2 ? '100%' : '0%' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-indigo-500' : 'bg-white/20'
                    }`}>
                      <CreditCard size={20} className="text-white" />
                    </div>
                    <span className={`font-medium ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
                      Payment
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">Shipping Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-white/80 text-sm mb-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="123 Main Street"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="New York"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Zip Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="10001"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-white/80 text-sm mb-2">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="United States"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            maxLength="19"
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="JOHN DOE"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/80 text-sm mb-2">Expiry Date</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              maxLength="5"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-white/80 text-sm mb-2">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              maxLength="3"
                              placeholder="123"
                              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 p-4 rounded-xl glass">
                        <h4 className="text-white font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-white/80">
                              <span>{item.name} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-white/20 flex justify-between text-white font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 flex items-center justify-between gap-4">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl glass text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </motion.button>
                )}
                
                <div className="flex-1" />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    (step === 1 ? isStep1Valid : isStep2Valid)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                      : 'glass text-white/50 cursor-not-allowed'
                  }`}
                >
                  {step === 1 ? (
                    <>
                      Continue
                      <ArrowRight size={20} />
                    </>
                  ) : (
                    <>
                      Complete Order
                      <CheckCircle size={20} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
