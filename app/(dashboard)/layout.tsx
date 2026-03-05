'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PackageOpen,
  Users,
  DollarSign,
  Settings,
  Zap,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/plans', icon: PackageOpen, label: 'My Plans' },
  { href: '/subscribers', icon: Users, label: 'Subscribers' },
  { href: '/revenue', icon: DollarSign, label: 'Revenue' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setUser(profile)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <Zap size={24} fill="#FF6B00" style={{color: '#FF6B00'}} />
        <span className="text-xl font-extrabold" style={{color: '#FF6B00'}}>CreatorPay</span>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{backgroundColor: '#FF6B00'}}>
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name}</p>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 4, backgroundColor: isActive ? '#FF6B00' : '#FFF3EC' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#FF6B00' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#6B7280',
                }}
              >
                <Icon size={18} />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-100">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4, backgroundColor: '#FEF2F2' }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-medium text-gray-500 transition-colors"
          style={{color: undefined}}
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: mobileOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-30 lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Zap size={20} fill="#FF6B00" style={{color: '#FF6B00'}} />
            <span className="font-extrabold" style={{color: '#FF6B00'}}>CreatorPay</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
