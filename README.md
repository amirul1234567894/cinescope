# 🎬 CineScope — Premium Movie & Entertainment Platform

> A cinematic, ultra-premium movie discovery platform inspired by Netflix + IMDb + Letterboxd. Built with Next.js 15, Supabase, TMDb API, and Framer Motion.

![CineScope](https://cinescope.vercel.app/og-image.jpg)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/cinescope)

---

## ✨ Features

- 🎬 **Movie & TV Discovery** — Powered by TMDb API (1M+ titles)
- 🔥 **Trending & Recommendations** — Real-time trending from TMDb
- 🌍 **Regional Cinema** — Hollywood, Bollywood, Korean, Anime, Bengali, and more
- 🎞️ **Official Trailers** — YouTube iframe embeds (legally compliant)
- 👥 **Celebrity Profiles** — Full filmographies, biographies
- ⭐ **Reviews & Ratings** — User reviews with Supabase
- 📚 **Watchlist & Favorites** — Cloud-synced user lists
- 📰 **Entertainment News** — Latest cinema news
- 🤖 **AI Recommendations** — OpenAI-powered (optional)
- 🔍 **Smart Search** — Real-time search with TMDb
- 📊 **Admin Dashboard** — Content management
- ⚡ **Ultra Fast** — ISR, Edge rendering, image optimization
- 🎨 **Cinematic UI** — Glassmorphism, Framer Motion, 3D effects
- 📱 **Fully Responsive** — Mobile-first design
- 🔒 **100% Legal** — No pirated content, AdSense-friendly

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS |
| **Animation** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Movie Data** | TMDb API |
| **Trailers** | YouTube Data API |
| **Automation** | n8n |
| **Deployment** | Vercel |
| **Storage** | Supabase Storage |

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cinescope.git
cd cinescope
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:
- **TMDB_API_KEY** → [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **NEXT_PUBLIC_SUPABASE_URL** → [app.supabase.com](https://app.supabase.com)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** → Supabase Settings → API
- **YOUTUBE_API_KEY** → [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)

### 3. Set Up Supabase Database

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor**
3. Run the migration file:
```sql
-- Copy and paste contents of:
-- supabase/migrations/001_initial_schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📦 Project Structure

```
cinescope/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── movie/[slug]/       # Movie detail page
│   │   ├── tv/[slug]/          # TV show detail page
│   │   ├── person/[id]/        # Celebrity profile page
│   │   ├── search/             # Search results page
│   │   ├── watchlist/          # User watchlist
│   │   ├── api/                # API routes
│   │   │   ├── search/         # Search endpoint
│   │   │   ├── og/             # Dynamic OG image
│   │   │   └── sitemap/        # Dynamic sitemap
│   │   ├── about/              # About page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms & conditions
│   │   ├── dmca/               # DMCA policy
│   │   └── contact/            # Contact page
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Providers
│   │   ├── home/               # Hero, Trending, Genres, etc.
│   │   ├── movies/             # Movie cards, cast, trailers
│   │   ├── effects/            # Particles, background effects
│   │   └── ui/                 # Shared UI components
│   ├── lib/
│   │   ├── tmdb.ts             # TMDb API client
│   │   └── supabase.ts         # Supabase client
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── styles/
│       └── globals.css         # Global styles + design system
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── n8n/
│   └── workflow-trending-movies.json
├── public/
│   ├── robots.txt
│   └── manifest.json
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🌐 Deployment Guide

### Vercel (Recommended — Free Tier)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add all environment variables from `.env.example`
5. Click **Deploy** ✅

Vercel handles:
- Automatic deployments on every git push
- Edge network CDN
- ISR (Incremental Static Regeneration)
- Environment variable management
- Custom domain setup

### n8n Automation Setup

1. Create a free account at [n8n.io](https://n8n.io) or self-host on Render
2. Import the workflow from `n8n/workflow-trending-movies.json`
3. Configure your TMDb API key and Supabase credentials
4. Activate the workflow

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `cinema-black` | `#050507` | Main background |
| `cinema-dark` | `#0a0a0f` | Secondary background |
| `cinema-surface` | `#111118` | Card backgrounds |
| `crimson-600` | `#dc2626` | Primary accent |
| `crimson-800` | `#991b1b` | Dimmed accent |

### CSS Classes
- `.glass` — Basic glassmorphism
- `.glass-card` — Card with hover effects
- `.glass-nav` — Navigation bar
- `.glass-modal` — Modal backdrop
- `.btn-primary` — Red glow button
- `.btn-glass` — Glass button
- `.movie-card` — 3D hover movie card
- `.skeleton` — Shimmer loading state
- `.gradient-border` — Animated gradient border
- `.genre-chip` — Genre tag badge
- `.section-title` — Gradient text heading
- `.neon-line` — Red glowing divider

---

## ⚖️ Legal

- All movie data from [TMDb API](https://www.themoviedb.org) — properly attributed
- Trailers embedded from YouTube official channels — no direct hosting
- No pirated content of any kind
- Google AdSense friendly
- DMCA compliant

> **TMDb Attribution:** This product uses the TMDb API but is not endorsed or certified by TMDb.

---

## 📄 License

MIT License — Free to use, modify, and deploy.

---

## 🤝 Contributing

Pull requests welcome! Please read the contribution guidelines.

---

*Built with ❤️ for cinema lovers worldwide.*
