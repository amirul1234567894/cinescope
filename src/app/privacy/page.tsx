import type { Metadata } from 'next'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'CineScope privacy policy — how we handle your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-white/40 text-sm">Last updated: January 2025</p>
          </div>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          {[
            {
              title: '1. Information We Collect',
              body: `We collect information you provide directly to us, such as when you create an account, submit a review, or contact us. This includes your email address, username, and profile information. We also automatically collect certain information about your device and how you interact with our platform.`,
            },
            {
              title: '2. How We Use Your Information',
              body: `We use the information we collect to provide, maintain, and improve our services; process transactions; send technical notices and support messages; respond to your comments and questions; and send marketing communications (with your consent).`,
            },
            {
              title: '3. Information Sharing',
              body: `We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this policy. We may share your information with third-party service providers who assist us in operating our platform (such as Supabase for database and authentication).`,
            },
            {
              title: '4. Third-Party APIs',
              body: `CineScope uses the TMDb API for movie data. This product uses the TMDb API but is not endorsed or certified by TMDb. We also use YouTube Data API for trailer embeds. These third-party services have their own privacy policies.`,
            },
            {
              title: '5. Cookies',
              body: `We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies, but some features may not function properly without them.`,
            },
            {
              title: '6. Data Security',
              body: `We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.`,
            },
            {
              title: '7. Children\'s Privacy',
              body: `Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
            },
            {
              title: '8. Contact Us',
              body: `If you have questions about this Privacy Policy, please contact us at: privacy@cinescope.app`,
            },
          ].map(section => (
            <div key={section.title} className="glass-card rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-3">{section.title}</h2>
              <p className="text-white/60 leading-relaxed text-sm">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
