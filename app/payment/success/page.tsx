'use client'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{backgroundColor: '#E8F8F5'}}
        >
          <CheckCircle size={40} style={{color: '#00B894'}} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your subscription is now active. You will receive Telegram access shortly.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs text-gray-400">Order ID</p>
              <p className="text-sm font-mono font-semibold text-gray-700 mt-0.5 break-all">{orderId}</p>
            </div>
          )}

          <div className="space-y-3 text-left mb-8">
            {[
              'Payment verified successfully',
              'Telegram invite will be sent shortly',
              'Check your email for confirmation',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor: '#E8F8F5'}}>
                  <CheckCircle size={14} style={{color: '#00B894'}} />
                </div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{backgroundColor: '#FF6B00'}}
            >
              <Home size={16} />
              Go to Homepage
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
