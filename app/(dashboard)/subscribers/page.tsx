'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchSubscribers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('subscriptions')
        .select('*, plans(name)')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
      setSubscribers(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetchSubscribers()
  }, [])

  useEffect(() => {
    let result = subscribers
    if (search) {
      result = result.filter(s =>
        s.subscriber_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.subscriber_email?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter)
    }
    setFiltered(result)
  }, [search, statusFilter, subscribers])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#E8F8F5', color: '#00B894' }
      case 'expired': return { bg: '#FFE8E8', color: '#FF4444' }
      default: return { bg: '#FFF9E6', color: '#FFB800' }
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Subscribers</h1>
        <p className="text-gray-500 mt-1">Manage all your subscribers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border-2 border-gray-200 rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
      >
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-400">No subscribers found</p>
            <p className="text-sm text-gray-300 mt-1">
              {search || statusFilter !== 'all' ? 'Try changing your filters' : 'Share your plan link to get subscribers'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscriber</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expires</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((sub, i) => {
                    const statusStyle = getStatusStyle(sub.status)
                    return (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{backgroundColor: '#FF6B00'}}>
                              {sub.subscriber_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{sub.subscriber_name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Mail size={11} />
                                {sub.subscriber_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{sub.plans?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900 text-sm">
                            ₹{((sub.amount_paid || 0) / 100).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} />
                            {formatDate(sub.expires_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                            {sub.status}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((sub, i) => {
                const statusStyle = getStatusStyle(sub.status)
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{backgroundColor: '#FF6B00'}}>
                          {sub.subscriber_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{sub.subscriber_name}</p>
                          <p className="text-xs text-gray-400">{sub.subscriber_email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize" style={{backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 ml-12">
                      <span>{sub.plans?.name}</span>
                      <span className="font-semibold text-gray-900">₹{((sub.amount_paid || 0) / 100).toLocaleString('en-IN')}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(sub.expires_at)}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} of {subscribers.length} subscribers</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
