'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, LogOut, Settings, Bookmark, Heart, Star, Loader2, Edit3, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [stats, setStats] = useState({ watchlist: 0, favorites: 0, reviews: 0 })
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '')
      setFullName(profile.full_name || '')
    }
  }, [profile])

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      const supabase = createClient()
      const [w, f, r] = await Promise.all([
        supabase.from('watchlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setStats({
        watchlist: w.count || 0,
        favorites: f.count || 0,
        reviews: r.count || 0,
      })
    }
    fetchStats()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ bio, full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save')
    } else {
      toast.success('Profile updated!')
      setEditing(false)
      window.location.reload()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    )
  }

  if (!user || !profile) return null

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-3xl font-bold text-white shadow-glow-red-sm">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-white/40 text-sm mb-3">@{profile.username}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Member since {memberSince}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-glass text-sm">
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            <button onClick={signOut} className="btn-glass text-sm hover:border-red-500/30 hover:text-red-400">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Bookmark, label: 'Watchlist', value: stats.watchlist, href: '/watchlist' },
            { icon: Heart, label: 'Favorites', value: stats.favorites, href: '/watchlist' },
            { icon: Star, label: 'Reviews', value: stats.reviews, href: '#' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="glass-card rounded-xl p-5 text-center hover:border-red-500/20 transition-all cursor-pointer">
                <stat.icon className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bio Section */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">About</h2>
            {editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(false); setBio(profile.bio || ''); setFullName(profile.full_name || '') }}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-xs py-1 px-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="search-input w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={250}
                  className="search-input w-full rounded-xl px-4 py-2.5 text-sm resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-white/25 mt-1">{bio.length}/250</p>
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-sm leading-relaxed">
              {profile.bio || <span className="text-white/30 italic">No bio yet. Click Edit to add one.</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
