'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Twitter, Instagram, ArrowUpRight, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Terms', href: '/terms' },
  ]

  return (
    <footer className="w-full relative overflow-hidden bg-[#0A0A0A] pt-20 pb-10">
      {/* Background Gradient Design */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-30" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF6B00] opacity-[0.03] blur-[120px] rounded-full" />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo & Brand Info (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.2)] group-hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all duration-500">
                <Zap size={22} fill="white" color="white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Creator<span className="text-[#FF6B00]">Pay</span>
              </span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              The ultimate payment bridge for India's digital economy. Fast, secure, and built for you.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all cursor-pointer">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for Desktop */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Links (Span 3) */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[2px] text-white/50">Navigation</h4>
            <div className="grid gap-4">
              {footerLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all cursor-pointer w-fit"
                >
                  <span className="h-[1px] w-0 bg-[#FF6B00] group-hover:w-4 transition-all duration-300" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action (Span 3) */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[2px] text-white/50">Ready to start?</h4>
            <Link href="/signup">
              <button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C33] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_10px_20px_-10px_rgba(255,107,0,0.5)] cursor-pointer group">
                Get Started Now
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Line & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <span>© {currentYear} CreatorPay</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full" />
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4 bg-[#151515] px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase">Systems Operational: India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}