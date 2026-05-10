import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'CineScope terms of service and usage conditions.',
}

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      body: 'By accessing and using CineScope, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.',
    },
    {
      title: '2. Use of Service',
      body: 'CineScope is a movie discovery and entertainment platform. You may use the platform for personal, non-commercial purposes. You agree not to scrape, copy, or redistribute our content without written permission.',
    },
    {
      title: '3. User Accounts',
      body: 'You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activities that occur under your account. You must provide accurate information when creating your account.',
    },
    {
      title: '4. Content & Copyright',
      body: 'Movie data, posters and images are sourced from TMDb API under their terms of service. Trailers are embedded from official YouTube channels. CineScope does not host, distribute, or facilitate access to pirated content.',
    },
    {
      title: '5. User-Generated Content',
      body: 'By submitting reviews, comments, or other content, you grant CineScope a non-exclusive, worldwide license to use, display, and distribute that content. You are solely responsible for your content and must ensure it does not violate any laws or third-party rights.',
    },
    {
      title: '6. Prohibited Activities',
      body: 'You may not use CineScope to: post spam or illegal content, harass other users, attempt to gain unauthorized access, use automated scripts without permission, or engage in any activity that could harm the platform.',
    },
    {
      title: '7. Disclaimer of Warranties',
      body: 'CineScope is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on the platform.',
    },
    {
      title: '8. Limitation of Liability',
      body: 'CineScope shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.',
    },
    {
      title: '9. Changes to Terms',
      body: 'We reserve the right to modify these terms at any time. Continued use of CineScope after changes constitutes acceptance of the new terms.',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Terms & Conditions</h1>
            <p className="text-white/40 text-sm">Last updated: January 2025</p>
          </div>
        </div>
        <div className="space-y-4">
          {sections.map(s => (
            <div key={s.title} className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-2">{s.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
