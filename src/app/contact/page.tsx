'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: submit to Supabase or email service
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
          <p className="text-white/40">We'll get back to you within 24 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Contact Us</h1>
            <p className="text-white/40 text-sm">We typically respond within 24 hours</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="search-input w-full rounded-xl px-4 py-3 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="search-input w-full rounded-xl px-4 py-3 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                className="search-input w-full rounded-xl px-4 py-3 text-sm"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="bug">Bug Report</option>
                <option value="dmca">DMCA / Copyright</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                className="search-input w-full rounded-xl px-4 py-3 text-sm resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/8 space-y-2">
            <p className="text-xs text-white/30">
              <strong className="text-white/40">Email:</strong> support@cinescope.app
            </p>
            <p className="text-xs text-white/30">
              <strong className="text-white/40">DMCA:</strong> dmca@cinescope.app
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
