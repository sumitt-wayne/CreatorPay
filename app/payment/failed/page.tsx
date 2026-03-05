'use client'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{backgroundColor: '#FFE8E8'}}
        >
          <XCircle size={40} style={{color: '#FF4444'}} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 text-sm mb-8">
            Something went wrong with your payment. Please try again.
          </p>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.back()}
              className="w-full text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{backgroundColor: '#FF6B00'}}
            >
              <RefreshCw size={16} />
              Try Again
            </motion.button>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Home size={16} />
                Go to Homepage
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
