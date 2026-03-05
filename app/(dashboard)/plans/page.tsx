'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PackageOpen,
  Plus,
  Users,
  Clock,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '30',
    features: [''],
  })
  const supabase = createClient()

  const fetchPlans = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('plans')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
    setPlans(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPlans() }, [])

  const handleAddFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...form.features]
    updated[index] = value
    setForm(prev => ({ ...prev, features: updated }))
  }

  const handleRemoveFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleSavePlan = async () => {
    if (!form.name || !form.price) {
      setError('Plan name and price are required.')
      return
    }
    if (parseInt(form.price) < 49) {
      setError('Minimum price is ₹49.')
      return
    }

    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('plans').insert({
      creator_id: user.id,
      name: form.name,
      description: form.description,
      price: parseInt(form.price) * 100,
      duration_days: parseInt(form.duration_days),
      features: form.features.filter(f => f.trim() !== ''),
      is_active: true,
    })

    if (error) {
      setError('Could not save plan. Please try again.')
      setSaving(false)
      return
    }

    setShowModal(false)
    setForm({ name: '', description: '', price: '', duration_days: '30', features: [''] })
    fetchPlans()
    setSaving(false)
  }

  const handleToggle = async (plan: any) => {
    await supabase
      .from('plans')
      .update({ is_active: !plan.is_active })
      .eq('id', plan.id)
    fetchPlans()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    await supabase.from('plans').delete().eq('id', id)
    fetchPlans()
  }

  const durations = [
    { label: '1 Month', value: '30' },
    { label: '3 Months', value: '90' },
    { label: '1 Year', value: '365' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Plans</h1>
          <p className="text-gray-500 mt-1">Create and manage your subscription plans</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-white font-bold px-5 py-3 rounded-xl text-sm"
          style={{backgroundColor: '#FF6B00'}}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Plan</span>
        </motion.button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 text-center"
          style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
        >
          <PackageOpen size={48} className="mx-auto mb-4" style={{color: '#FF6B00'}} />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No plans yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first plan to start accepting payments</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="text-white font-bold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
            style={{backgroundColor: '#FF6B00'}}
          >
            <Plus size={16} /> Create First Plan
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl p-6 relative"
              style={{boxShadow: '0 2px 12px rgba(0,0,0,0.04)'}}
            >
              {/* Active Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: plan.is_active ? '#E8F8F5' : '#F5F5F5',
                    color: plan.is_active ? '#00B894' : '#9CA3AF'
                  }}
                >
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-lg pr-16">{plan.name}</h3>
              {plan.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{plan.description}</p>
              )}

              <div className="mt-4 mb-4">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{(plan.price / 100).toLocaleString('en-IN')}
                </span>
                <span className="text-gray-400 text-sm ml-1">/ {plan.duration_days} days</span>
              </div>

              {/* Features */}
              {plan.features?.length > 0 && (
                <ul className="space-y-1 mb-4">
                  {plan.features.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={14} style={{color: '#FF6B00'}} />
                      {f}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-gray-400">+{plan.features.length - 3} more</li>
                  )}
                </ul>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-4 mb-4">
                <span className="flex items-center gap-1"><Users size={12} /> 0 subscribers</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {plan.duration_days}d</span>
                <span className="flex items-center gap-1"><DollarSign size={12} /> ₹{(plan.price / 100).toLocaleString('en-IN')}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggle(plan)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-100 text-gray-500 hover:border-gray-200 transition-colors"
                >
                  {plan.is_active
                    ? <ToggleRight size={14} style={{color: '#00B894'}} />
                    : <ToggleLeft size={14} />
                  }
                  {plan.is_active ? 'Disable' : 'Enable'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(plan.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Create New Plan</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Stock Market Basic"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What will subscribers get?"
                      rows={2}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 resize-none"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="499"
                        min="49"
                        className="w-full border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900"
                      />
                    </div>
                    {form.price && parseInt(form.price) >= 49 && (
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        You will receive: <span className="font-semibold" style={{color: '#00B894'}}>₹{Math.floor(parseInt(form.price) * 0.95)}</span> (after 5% platform fee)
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {durations.map(d => (
                        <motion.button
                          key={d.value}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm(prev => ({ ...prev, duration_days: d.value }))}
                          className="py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                          style={{
                            borderColor: form.duration_days === d.value ? '#FF6B00' : '#E5E7EB',
                            backgroundColor: form.duration_days === d.value ? '#FFF3EC' : 'white',
                            color: form.duration_days === d.value ? '#FF6B00' : '#6B7280',
                          }}
                        >
                          {d.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What is included?</label>
                    <div className="space-y-2">
                      {form.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check size={14} style={{color: '#FF6B00'}} className="shrink-0" />
                          <input
                            type="text"
                            value={feature}
                            onChange={e => handleFeatureChange(i, e.target.value)}
                            placeholder={`Feature ${i + 1}`}
                            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900"
                          />
                          {form.features.length > 1 && (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveFeature(i)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </motion.button>
                          )}
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddFeature}
                      className="mt-2 text-sm font-semibold flex items-center gap-1"
                      style={{color: '#FF6B00'}}
                    >
                      <Plus size={14} /> Add feature
                    </motion.button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSavePlan}
                    disabled={saving}
                    className="flex-2 flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{backgroundColor: '#FF6B00'}}
                  >
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      <><Check size={16} /> Create Plan</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
