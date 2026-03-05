'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import Navbar from '@/components/landing/Navbar'
import {
  Zap, ArrowRight, CheckCircle,
  Bot, Shield, Repeat, Smartphone, BarChart2,
  DollarSign, Star, Users, TrendingUp, Bell
} from 'lucide-react'
import Footer from '@/components/landing/Footer'

const features = [
  { span: 2, dark: false, accent: false, icon: DollarSign, title: 'Instant UPI Payments', desc: 'Money hits your bank account instantly. No waiting, no settlement lag. Razorpay powered.', tag: '↗ Razorpay powered' },
  { span: 1, dark: true, accent: false, icon: Bot, title: 'Telegram Auto-Access', desc: 'Subscribers join your channel instantly after payment. Removed automatically when plan expires.', tag: null },
  { span: 1, dark: false, accent: true, icon: BarChart2, title: 'Smart Analytics', desc: 'Beautiful real-time charts — revenue, active members, and subscriber trends.', tag: null },
  { span: 1, dark: false, accent: false, icon: Repeat, title: 'Auto Renewal', desc: 'Expiry and removal without lifting a finger.', tag: null },
  { span: 1, dark: true, accent: false, icon: Smartphone, title: 'Mobile First', desc: "Built for India's mobile-only audience.", tag: null },
  { span: 2, dark: false, accent: false, icon: Shield, title: 'Bank-Grade Security', desc: 'Powered by Razorpay — fully PCI compliant, no stress, no liability.', tag: null },
]

const steps = [
  { step: '01', title: 'Signup →', desc: '2 minutes, no credit card' },
  { step: '02', title: 'Create plan →', desc: 'Set price & duration' },
  { step: '03', title: 'Connect Telegram →', desc: 'Bot setup < 5 min' },
  { step: '04', title: 'Share & earn →', desc: 'Auto pilot on' },
]

const testimonials = [
  { text: 'I was adding 50+ subscribers manually every month. CreatorPay fully automated it. Now I just check my dashboard.', name: 'Rahul S.', role: 'Market Educator', revenue: '₹45k/mo', avatar: 'R' },
  { text: 'My subscribers get instant access after payment — no more waiting, no more complaints. Exactly what I needed.', name: 'Priya M.', role: 'Fitness Coach', revenue: '₹28k/mo', avatar: 'P' },
  { text: 'Dashboard is beautiful. I can see active subscribers and earnings at a glance. Game changer.', name: 'Arjun N.', role: 'Trading Analyst', revenue: '₹62k/mo', avatar: 'A' },
]

const marqueeItems = [
  "✶ India's first auto-telegram paywall",
  "✶ 5% commission — you keep 95%",
  "✶ 1,200+ creators onboard",
  "✶ UPI · cards · wallets",
  "✶ Instant access after payment",
  "✶ Zero manual work",
]

function MarqueeStrip() {
  return (
    <div className="py-5 overflow-hidden border-t-2 border-b-2 mb-16" style={{ backgroundColor: '#1E1E1E', borderColor: '#FF6B00', transform: 'skewY(-1deg)' }}>
      <div style={{ transform: 'skewY(1deg)' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-white font-medium uppercase tracking-widest text-sm">{item}</span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Dashboard Mockup Component
function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md"
    >
      {/* Floating notification */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl z-20 flex items-center gap-3"
        style={{ border: '1px solid rgba(255,107,0,0.15)' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F8F5' }}>
          <TrendingUp size={16} style={{ color: '#00B894' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">New payment!</p>
          <p className="text-xs text-gray-400">₹499 received</p>
        </div>
      </motion.div>

      {/* Floating subscriber badge */}
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-6 bg-white rounded-2xl px-4 py-3 shadow-xl z-20 flex items-center gap-3"
        style={{ border: '1px solid rgba(255,107,0,0.15)' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF3EC' }}>
          <Users size={16} style={{ color: '#FF6B00' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">+12 subscribers</p>
          <p className="text-xs text-gray-400">This week</p>
        </div>
      </motion.div>

      {/* Main dashboard card */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Zap size={16} fill="#FF6B00" style={{ color: '#FF6B00' }} />
            <span className="font-extrabold text-sm" style={{ color: '#FF6B00' }}>CreatorPay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <Bell size={12} style={{ color: '#FF6B00' }} />
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#FF6B00' }}>R</div>
          </div>
        </div>

        <div className="p-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Total Revenue', value: '₹12,450', color: '#FF6B00', bg: '#FFF3EC', icon: DollarSign },
              { label: 'Subscribers', value: '48', color: '#00B894', bg: '#E8F8F5', icon: Users },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="rounded-2xl p-4"
                style={{ backgroundColor: s.bg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <s.icon size={14} style={{ color: s.color }} />
                  <TrendingUp size={12} style={{ color: s.color }} />
                </div>
                <p className="font-extrabold text-lg text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Mini chart bars */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#F8F8F6' }}>
            <p className="text-xs font-semibold text-gray-400 mb-3">Revenue — Last 6 months</p>
            <div className="flex items-end gap-2 h-16">
              {[30, 50, 40, 70, 60, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  className="flex-1 rounded-t-lg"
                  style={{ backgroundColor: i === 5 ? '#FF6B00' : '#FFD9B8' }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(m => (
                <span key={m} className="text-xs text-gray-300">{m}</span>
              ))}
            </div>
          </div>

          {/* Recent subscribers */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3">Recent Subscribers</p>
            <div className="space-y-2">
              {[
                { name: 'Rahul K.', plan: 'Pro Plan', amount: '₹999', status: 'active' },
                { name: 'Priya S.', plan: 'Basic Plan', amount: '₹499', status: 'active' },
                { name: 'Amit J.', plan: 'Pro Plan', amount: '₹999', status: 'active' },
              ].map((sub, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#FF6B00' }}>
                      {sub.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{sub.name}</p>
                      <p className="text-xs text-gray-400">{sub.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{sub.amount}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F8F5', color: '#00B894' }}>
                      {sub.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F5F3F0', color: '#1E1E1E' }}>
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-16">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FF6B00" strokeWidth="0.5" strokeOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>

        {/* Blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{ right: '5%', top: '15%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{ left: '5%', bottom: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,200,130,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl mx-auto pt-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

            {/* Left — Text */}
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 mb-8 shadow-sm"
                style={{ borderColor: 'rgba(255,107,0,0.2)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#FF6B00' }}
                />
                <span className="text-xs font-bold text-gray-600 tracking-widest uppercase">India's Creator Monetization Platform</span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 0.92, color: '#1E1E1E', letterSpacing: '-0.02em' }}
                >
                  GET PAID
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 0.92, background: 'linear-gradient(135deg, #FF6B00 20%, #FFA155 60%, #1E1E1E 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}
                >
                  FOR CONTENT.
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)', maxWidth: 520, marginBottom: '2.5rem', color: '#3a3a3a', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.6 }}
              >
                UPI · Telegram · analytics · fully automated.
                Built for creators who refuse to compromise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 24px 48px -8px rgba(255,107,0,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    className="text-white font-bold rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#FF6B00', padding: '1rem 2.2rem', fontSize: '1rem', boxShadow: '0 16px 32px -8px rgba(255,107,0,0.4)' }}
                  >
                    Start free <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.span
                    whileHover={{ x: 4 }}
                    className="font-semibold flex items-center gap-1 cursor-pointer"
                    style={{ borderBottom: '2px solid #1E1E1E', paddingBottom: '0.3rem', fontSize: '1rem' }}
                  >
                    Sign in →
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 md:gap-10"
              >
                {[
                  { val: '5%', label: 'fee only' },
                  { val: '< 5s', label: 'access granted' },
                  { val: '24/7', label: 'automation' },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }} className="flex items-baseline gap-2">
                    <span style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#1E1E1E' }}>{s.val}</span>
                    <span style={{ color: '#5a5a5a', fontSize: '0.85rem' }}>{s.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right — Dashboard Mockup */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <DashboardMockup />
            </div>
          </div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <MarqueeStrip />

      {/* FEATURES */}
      <section id="features" className="py-16 px-6 md:px-16" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-baseline gap-6 mb-16"
        >
          <h2 style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1 }}>
            tools,<br />not toys.
          </h2>
          <p style={{ maxWidth: 320, color: '#4a4a4a', fontSize: '1.1rem' }}>
            Everything hyper-optimized for the Indian creator — from instant UPI to subscriber expiry.
          </p>
        </motion.div>

        {/* Mobile: single col, Desktop: mosaic grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-3xl p-7 transition-all cursor-default"
                style={{
                  gridColumn: window && window.innerWidth >= 1024 ? `span ${f.span}` : 'span 1',
                  backgroundColor: f.dark ? '#1E1E1E' : f.accent ? '#FAF3E9' : '#E6E3DF',
                  color: f.dark ? 'white' : '#1E1E1E',
                  boxShadow: f.dark ? '0 30px 40px -20px rgba(0,0,0,0.4)' : '0 30px 40px -20px rgba(0,0,0,0.1)',
                  border: f.dark ? '1px solid #FF6B00' : '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#FF6B00' }}
                >
                  <Icon size={22} color="white" />
                </motion.div>
                <h3 style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', marginBottom: '0.75rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: f.dark ? '#b5b5b5' : '#3a3a3a', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
                {f.tag && (
                  <div className="mt-5 font-semibold" style={{ color: '#FF6B00' }}>{f.tag}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="my-20 py-16" style={{ backgroundColor: 'white', transform: 'rotate(0.8deg) scale(1.02)', boxShadow: '0 -20px 40px rgba(0,0,0,0.02)' }}>
        <div style={{ transform: 'rotate(-0.8deg)', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-bold uppercase tracking-widest text-sm mb-12"
            style={{ color: '#FF6B00' }}
          >
            How it works
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="p-6"
              >
                <div style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: '5rem', color: '#FF6B00', opacity: 0.35, lineHeight: 1, marginBottom: '0.5rem' }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ color: '#5a5a5a' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 md:px-16" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="font-bold uppercase tracking-widest text-sm mb-3" style={{ color: '#FF6B00' }}>Testimonials</p>
          <h2 style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Creators love it.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 30px 50px -15px rgba(255,107,0,0.15)' }}
              className="bg-white rounded-3xl p-8 transition-all"
              style={{ boxShadow: '0 15px 35px -10px rgba(255,107,0,0.1)' }}
            >
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="#FF6B00" style={{ color: '#FF6B00' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: '#3a3a3a', fontSize: '1rem' }}>"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#FF6B00' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: '#6f6f6f' }}>{t.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#9a9a9a' }}>Earning</p>
                  <p className="font-bold text-sm" style={{ color: '#00B894' }}>{t.revenue}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6" style={{ backgroundColor: '#FF6B00', clipPath: 'polygon(0 5%, 100% 0%, 100% 95%, 0% 100%)', margin: '4rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto bg-white rounded-3xl p-10 md:p-12"
          style={{ boxShadow: '0 40px 80px -20px #B33F00' }}
          whileHover={{ y: -4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ backgroundColor: '#FFEDE0' }}>
            <Zap size={14} fill="#FF6B00" style={{ color: '#FF6B00' }} />
            <span className="text-sm font-bold" style={{ color: '#FF6B00' }}>Free to start</span>
          </div>
          <div style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 800, fontSize: 'clamp(5rem, 12vw, 7rem)', lineHeight: 1, color: '#FF6B00', marginBottom: '0.5rem' }}>5%</div>
          <p style={{ color: '#4a4a4a', marginBottom: '2rem' }}>per transaction · nothing else</p>
          <hr style={{ borderColor: '#eee', marginBottom: '2rem' }} />
          <div className="space-y-3 mb-8">
            {['Unlimited plans', 'Unlimited subscribers', 'Telegram automation', 'Revenue dashboard', 'Payment receipts', 'Auto expiry management'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
                <CheckCircle size={16} style={{ color: '#FF6B00' }} />
                <span style={{ color: '#3a3a3a' }}>{item}</span>
              </motion.div>
            ))}
          </div>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 16px 32px rgba(255,107,0,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-white font-bold rounded-full flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FF6B00', padding: '1.1rem', fontSize: '1rem' }}
            >
              Get started free <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          style={{ backgroundColor: '#1E1E1E' }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute pointer-events-none"
            style={{ top: '-20%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          <div className="relative z-10">
            <h2 className="font-extrabold text-white mb-4" style={{ fontFamily: 'Baloo 2, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Start earning today.
            </h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: '#9a9a9a', fontSize: '1.1rem' }}>
              Join hundreds of creators already using CreatorPay to monetize their audience on autopilot.
            </p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#FF6B00', color: 'white' }}
                whileTap={{ scale: 0.97 }}
                className="font-bold rounded-full flex items-center gap-2 mx-auto transition-all"
                style={{ backgroundColor: 'white', color: '#1E1E1E', padding: '1.1rem 2.8rem', fontSize: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              >
                Create free account <ArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  )
}
