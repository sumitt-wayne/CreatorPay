'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Zap, CheckCircle, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden" style={{backgroundColor: '#FF6B00'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-6 h-full w-full p-4">
            {Array.from({length: 64}).map((_, i) => (
              <div key={i} className="rounded-full bg-white w-6 h-6" />
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap size={48} fill="white" />
            <h1 className="text-5xl font-extrabold">CreatorPay</h1>
          </div>
          <p className="text-xl opacity-90 mb-10">Monetize your audience. Automate everything.</p>
          <div className="space-y-3 text-left">
            {[
              "Accept UPI payments instantly",
              "Auto-manage Telegram access",
              "Beautiful creator dashboard",
              "Start for free, always"
            ].map((item, i) => (
              <div key={i} className="bg-white/20 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-3">
                <CheckCircle size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <Zap size={32} fill="#FF6B00" style={{color: '#FF6B00'}} />
            <h1 className="text-2xl font-extrabold" style={{color: '#FF6B00'}}>CreatorPay</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to your creator account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-12 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-2"
              style={{backgroundColor: '#FF6B00'}}
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Signing in...</>
              ) : (
                <><Zap size={20} /> Sign In</>
              )}
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold hover:underline" style={{color: '#FF6B00'}}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
