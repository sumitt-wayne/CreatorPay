'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  User,
  AtSign,
  FileText,
  Bot,
  Hash,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    telegram_bot_token: '',
    telegram_channel_id: '',
  })
  
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          telegram_bot_token: profile.telegram_bot_token || '',
          telegram_channel_id: profile.telegram_channel_id || '',
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!form.full_name || !form.username) {
      setError('Name and username are required.')
      return
    }
    
    setSaving(true)
    setError('')
    setSuccess('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        username: form.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
        bio: form.bio,
        telegram_bot_token: form.telegram_bot_token,
        telegram_channel_id: form.telegram_channel_id,
      })
      .eq('id', user.id)

    if (error) {
      setError('Could not save settings. Please try again.')
    } else {
      setSuccess('Settings saved successfully.')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-48" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and integrations</p>
      </div>

      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-2"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm flex items-center gap-2"
        >
          <CheckCircle size={16} />
          {success}
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      >
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-400 mt-0.5">Update your public profile details</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="yourname"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
              />
            </div>
            {form.username && (
              <p className="text-xs mt-1 ml-1 font-medium" style={{color: '#FF6B00'}}>
                Your page: creatorpay.in/{form.username.toLowerCase().replace(/[^a-z0-9]/g, '')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <textarea
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell your audience about yourself..."
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900 resize-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Telegram Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      >
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Telegram Setup</h2>
          <p className="text-sm text-gray-400 mt-0.5">Connect your bot for auto access management</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">Setup Guide</p>
            <div className="space-y-2">
              {[
                'Open Telegram and search for @BotFather',
                'Send /newbot and follow the steps',
                'Copy the bot token and paste below',
                'Add your bot as admin in your channel',
                'Paste your channel ID below',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5" style={{backgroundColor: '#FF6B00'}}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-orange-800">{step}</p>
                </div>
              ))}
            </div>
            
            <a 
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold mt-4 w-fit" 
              style={{color: '#FF6B00'}}
            >
              <ExternalLink size={12} />
              Open BotFather on Telegram
            </a>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bot Token</label>
            <div className="relative">
              <Bot size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.telegram_bot_token}
                onChange={e => setForm(prev => ({ ...prev, telegram_bot_token: e.target.value }))}
                placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Channel ID</label>
            <div className="relative">
              <Hash size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.telegram_channel_id}
                onChange={e => setForm(prev => ({ ...prev, telegram_channel_id: e.target.value }))}
                placeholder="@yourchannel or -1001234567890"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md active:shadow-sm"
        style={{backgroundColor: '#FF6B00'}}
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" /> 
            Saving...
          </>
        ) : (
          <>
            <Save size={18} /> 
            Save Settings
          </>
        )}
      </motion.button>
    </div>
  )
}