import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'DMCA Policy',
  description: 'CineScope DMCA takedown policy and copyright information.',
}

export default function DmcaPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">DMCA Policy</h1>
            <p className="text-white/40 text-sm">Digital Millennium Copyright Act</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Our Commitment',
              body: 'CineScope respects intellectual property rights and expects its users to do the same. We do not host, store, or distribute any copyrighted movie files, TV show episodes, or other protected content. All movie data is sourced from TMDb API, and all video content is embedded from official YouTube channels only.',
            },
            {
              title: 'What We Show',
              body: 'CineScope displays: Movie metadata (titles, descriptions, ratings) from TMDb API; Movie posters and backdrop images via TMDb API; Official trailers embedded from YouTube using the YouTube IFrame Player API; User-generated reviews and ratings; Original editorial content created by our team.',
            },
            {
              title: 'DMCA Takedown Requests',
              body: 'If you believe that content on CineScope infringes your copyright, please send a DMCA takedown notice to: dmca@cinescope.app. Your notice must include: your contact information; identification of the copyrighted work; identification of the allegedly infringing material and its location on our site; a statement of good faith belief; a statement of accuracy under penalty of perjury; your physical or electronic signature.',
            },
            {
              title: 'Counter-Notification',
              body: 'If you believe content was removed in error, you may submit a counter-notification to the same email address with the required information under 17 U.S.C. § 512(g)(3).',
            },
            {
              title: 'Repeat Infringers',
              body: 'CineScope will terminate the accounts of repeat infringers in appropriate circumstances.',
            },
            {
              title: 'Contact',
              body: 'For DMCA notices: dmca@cinescope.app\nFor general legal inquiries: legal@cinescope.app',
            },
          ].map(s => (
            <div key={s.title} className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-2">{s.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
