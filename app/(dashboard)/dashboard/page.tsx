'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Users,
  PackageOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Activity
} from 'lucide-react'
import Link from 'next/link'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' }
  })
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    totalPlans: 0,
    todayRevenue: 0,
  })
  const [recentSubscribers, setRecentSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setUser(profile)

      // Fetch stats
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('creator_id', user.id)

      const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .eq('creator_id', user.id)

      const today = new Date().toISOString().split('T')[0]
      const activeSubs = subs?.filter(s => s.status === 'active') || []
      const todaySubs = subs?.filter(s => s.created_at?.startsWith(today) && s.status === 'active') || []
      const totalRevenue = activeSubs.reduce((sum, s) => sum + (s.amount_paid || 0), 0)
      const todayRevenue = todaySubs.reduce((sum, s) => sum + (s.amount_paid || 0), 0)

      setStats({
        totalRevenue,
        activeSubscribers: activeSubs.length,
        totalPlans: plans?.length || 0,
        todayRevenue,
      })

      // Recent subscribers
      const { data: recent } = await supabase
        .from('subscriptions')
        .select('*, plans(name)')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentSubscribers(recent || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100).toLocaleString('en-IN')}`,
      subtitle: 'All time earnings',
      icon: DollarSign,
      color: '#FF6B00',
      bg: '#FFF3EC',
    },
    {
      title: 'Active Subscribers',
      value: stats.activeSubscribers.toString(),
      subtitle: 'Currently active',
      icon: Users,
      color: '#00B894',
      bg: '#E8F8F5',
    },
    {
      title: 'Total Plans',
      value: stats.totalPlans.toString(),
      subtitle: 'Plans created',
      icon: PackageOpen,
      color: '#6C5CE7',
      bg: '#F0EDFF',
    },
    {
      title: "Today's Revenue",
      value: `₹${(stats.todayRevenue / 100).toLocaleString('en-IN')}`,
      subtitle: 'Earned today',
      icon: TrendingUp,
      color: '#E17055',
      bg: '#FEF0EC',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#E8F8F5', color: '#00B894' }
      case 'expired': return { bg: '#FFE8E8', color: '#FF4444' }
      default: return { bg: '#FFF9E6', color: '#FFB800' }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Good day, {user?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your account.</p>
      </motion.div>

      {/* No Plans Banner */}
      {stats.totalPlans === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{backgroundColor: '#FFF3EC', border: '2px dashed #FF6B00'}}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#FF6B00'}}>
              <PackageOpen size={24} color="white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Create your first plan</p>
              <p className="text-sm text-gray-500">Start accepting payments from your audience</p>
            </div>
          </div>
          <Link href="/plans">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-white font-bold px-5 py-3 rounded-xl text-sm whitespace-nowrap"
              style={{backgroundColor: '#FF6B00'}}
            >
              Create Plan <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 cursor-default"
              style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{backgroundColor: card.bg}}>
                  <Icon size={20} style={{color: card.color}} />
                </div>
                <ArrowUpRight size={16} className="text-gray-300" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-sm font-medium text-gray-400 mt-1">{card.title}</p>
              <p className="text-xs text-gray-300 mt-0.5">{card.subtitle}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Subscribers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-white rounded-2xl"
        style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Activity size={18} style={{color: '#FF6B00'}} />
            <h2 className="font-bold text-gray-900">Recent Subscribers</h2>
          </div>
          <Link href="/subscribers">
            <motion.span
              whileHover={{ x: 2 }}
              className="text-sm font-semibold flex items-center gap-1"
              style={{color: '#FF6B00'}}
            >
              View all <ArrowRight size={14} />
            </motion.span>
          </Link>
        </div>

        {recentSubscribers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No subscribers yet</p>
            <p className="text-gray-300 text-sm mt-1">Share your plan link to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentSubscribers.map((sub, i) => {
              const statusStyle = getStatusColor(sub.status)
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor: '#FF6B00'}}>
                      {sub.subscriber_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{sub.subscriber_name}</p>
                      <p className="text-xs text-gray-400">{sub.plans?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-sm text-gray-900">
                      ₹{((sub.amount_paid || 0) / 100).toLocaleString('en-IN')}
                    </p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                      {sub.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
