'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Check,
  Clock,
  Users,
  X,
  Mail,
  Phone,
  User,
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react'

declare global {
  interface Window { Razorpay: any }
}

export default function PublicCreatorClient({ creator, plans }: { creator: any, plans: any[] }) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', telegram_username: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowCheckout(true)
    setError('')
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = resolve
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')

    await loadRazorpay()

    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan.id, ...form })
    })

    const orderData = await res.json()

    if (!orderData.orderId) {
      setError('Could not create order. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: creator.full_name,
      description: selectedPlan.name,
      order_id: orderData.orderId,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: '#FF6B00' },
      handler: () => {
        window.location.href = `/payment/success?orderId=${orderData.orderId}`
      },
      modal: { ondismiss: () => setLoading(false) }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-extrabold" style={{backgroundColor: '#FF6B00'}}>
            {creator.full_name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{creator.full_name}</h1>
          {creator.bio && (
            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">{creator.bio}</p>
          )}
          <div className="flex items-center justify-center gap-1 mt-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">Active Creator</span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Choose a Plan</h2>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <Users size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400">No plans available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl p-6"
                style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-2xl font-extrabold text-gray-900">
                      ₹{(plan.price / 100).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 justify-end mt-0.5">
                      <Clock size={11} />
                      {plan.duration_days} days
                    </div>
                  </div>
                </div>

                {plan.features?.length > 0 && (
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={14} style={{color: '#FF6B00'}} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{backgroundColor: '#FF6B00'}}
                >
                  <Zap size={16} />
                  Subscribe — ₹{(plan.price / 100).toLocaleString('en-IN')}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs text-gray-300">
            Powered by <span className="font-bold" style={{color: '#FF6B00'}}>CreatorPay</span>
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowCheckout(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4"
            >
              <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md max-h-[92vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-gray-400">
                      ₹{(selectedPlan.price / 100).toLocaleString('en-IN')} for {selectedPlan.duration_days} days
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCheckout(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm flex items-center gap-2">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Your full name', icon: User, type: 'text', required: true },
                    { key: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: Mail, type: 'email', required: true },
                    { key: 'phone', label: 'Phone Number', placeholder: '9876543210', icon: Phone, type: 'tel', required: true },
                    { key: 'telegram_username', label: 'Telegram Username', placeholder: '@yourusername', icon: User, type: 'text', required: false },
                  ].map((field) => {
                    const Icon = field.icon
                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {field.label} {field.required && <span className="text-red-400">*</span>}
                        </label>
                        <div className="relative">
                          <Icon size={16} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type={field.type}
                            value={form[field.key as keyof typeof form]}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{backgroundColor: '#FF6B00'}}
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Shield size={18} /> Pay ₹{(selectedPlan.price / 100).toLocaleString('en-IN')} Securely</>
                    )}
                  </motion.button>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1"><Shield size={11} /> Secure Payment</span>
                    <span>UPI Supported</span>
                    <span>Instant Access</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
