'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  Calendar
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function RevenuePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    lastMonth: 0,
    totalSubscribers: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, plans(name)')
        .eq('creator_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

      const totalRevenue = subs?.reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0
      const thisMonth = subs?.filter(s => s.created_at >= thisMonthStart)
        .reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0
      const lastMonth = subs?.filter(s => s.created_at >= lastMonthStart && s.created_at <= lastMonthEnd)
        .reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0

      setStats({
        totalRevenue,
        thisMonth,
        lastMonth,
        totalSubscribers: subs?.length || 0,
      })

      // Chart data - last 6 months
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStart = date.toISOString()
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0).toISOString()
        const monthRevenue = subs?.filter(s =>
          s.created_at >= monthStart && s.created_at <= monthEnd
        ).reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0

        months.push({
          month: date.toLocaleDateString('en-IN', { month: 'short' }),
          revenue: monthRevenue / 100,
        })
      }
      setChartData(months)
      setTransactions(subs?.slice(0, 10) || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100).toLocaleString('en-IN')}`,
      subtitle: 'All time',
      icon: DollarSign,
      color: '#FF6B00',
      bg: '#FFF3EC',
    },
    {
      title: 'This Month',
      value: `₹${(stats.thisMonth / 100).toLocaleString('en-IN')}`,
      subtitle: 'Current month',
      icon: TrendingUp,
      color: '#00B894',
      bg: '#E8F8F5',
    },
    {
      title: 'Last Month',
      value: `₹${(stats.lastMonth / 100).toLocaleString('en-IN')}`,
      subtitle: 'Previous month',
      icon: Calendar,
      color: '#6C5CE7',
      bg: '#F0EDFF',
    },
    {
      title: 'Paid Subscribers',
      value: stats.totalSubscribers.toString(),
      subtitle: 'Total active',
      icon: Users,
      color: '#E17055',
      bg: '#FEF0EC',
    },
  ]

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm font-bold" style={{color: '#FF6B00'}}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Revenue</h1>
        <p className="text-gray-500 mt-1">Track your earnings and growth</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl p-6"
                style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{backgroundColor: card.bg}}>
                    <Icon size={20} style={{color: card.color}} />
                  </div>
                  <ArrowUpRight size={16} className="text-gray-200" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                <p className="text-sm font-medium text-gray-400 mt-1">{card.title}</p>
                <p className="text-xs text-gray-300 mt-0.5">{card.subtitle}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6"
        style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
      >
        <h2 className="font-bold text-gray-900 mb-6">Revenue — Last 6 Months</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="month" tick={{fontSize: 12, fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12, fill: '#9CA3AF'}} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#FFF3EC', radius: 8}} />
            <Bar dataKey="revenue" fill="#FF6B00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
      >
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <DollarSign size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.04 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{backgroundColor: '#FF6B00'}}>
                    {tx.subscriber_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{tx.subscriber_name}</p>
                    <p className="text-xs text-gray-400">{tx.plans?.name} · {formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  ₹{((tx.amount_paid || 0) / 100).toLocaleString('en-IN')}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
