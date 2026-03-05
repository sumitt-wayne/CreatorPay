'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Zap, ArrowRight, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  // Scroll logic: Agar scroll down ho raha hai toh hide, agar top par hai toh show
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 50) {
      setHidden(true) // Scroll down -> Hide
    } else {
      setHidden(false) // Scroll up/Top -> Show
    }
  })

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: -100, opacity: 0 },
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex items-center justify-between w-full max-w-5xl h-16 px-6 md:px-10 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-lg"
        >
          {/* Logo */}
          <Link href="/" className="cursor-pointer group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FF6B00]">
                <Zap size={18} fill="white" color="white" />
              </div>
              <span className="text-lg font-extrabold text-gray-900">
                Creator<span className="text-[#FF6B00]">Pay</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-[#FF6B00] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Section */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/login">
              <span className="text-sm font-semibold text-gray-600 hover:text-[#FF6B00] transition-all cursor-pointer">
                Sign in
              </span>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF6B00] text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer"
              >
                Get Started <ArrowRight size={14} />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-700 cursor-pointer"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center space-y-8"
          >
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-8 p-2 cursor-pointer"
            >
              <X size={30} />
            </button>

            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-3xl font-bold text-gray-800 hover:text-[#FF6B00] cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            
            <div className="flex flex-col gap-4 w-64">
              <Link href="/login" className="w-full">
                <button className="w-full py-4 border border-gray-200 rounded-full font-bold cursor-pointer">Sign in</button>
              </Link>
              <Link href="/signup" className="w-full">
                <button className="w-full py-4 bg-[#FF6B00] text-white rounded-full font-bold cursor-pointer">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}