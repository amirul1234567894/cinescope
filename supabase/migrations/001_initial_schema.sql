-- CineScope Complete Database Schema
-- Run this in Supabase SQL Editor

-- ─── EXTENSIONS ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For fast text search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- For accent-insensitive search

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  is_admin      BOOLEAN DEFAULT FALSE,
  sub_tier      TEXT DEFAULT 'free' CHECK (sub_tier IN ('free', 'premium')),
  preferences   JSONB DEFAULT '{
    "favorite_genres": [],
    "preferred_languages": ["en"],
    "notifications_enabled": true,
    "show_adult_content": false
  }',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WATCHLISTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.watchlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id   INTEGER,
  tv_id      INTEGER,
  priority   TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes      TEXT,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT watchlists_one_type CHECK (
    (movie_id IS NULL) != (tv_id IS NULL)
  ),
  UNIQUE(user_id, movie_id),
  UNIQUE(user_id, tv_id)
);

-- ─── FAVORITES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id   INTEGER,
  tv_id      INTEGER,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT favorites_one_type CHECK (
    (movie_id IS NULL) != (tv_id IS NULL)
  ),
  UNIQUE(user_id, movie_id),
  UNIQUE(user_id, tv_id)
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id    INTEGER,
  tv_id       INTEGER,
  rating      NUMERIC(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 5000),
  spoiler     BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT reviews_one_type CHECK (
    (movie_id IS NULL) != (tv_id IS NULL)
  ),
  UNIQUE(user_id, movie_id),
  UNIQUE(user_id, tv_id)
);

-- ─── REVIEW LIKES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.review_likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id  UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- ─── COMMENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id    INTEGER,
  tv_id       INTEGER,
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  parent_id   UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('review_like','comment_reply','new_release','recommendation','system')),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  data       JSONB DEFAULT '{}',
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ARTICLES / BLOG ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image     TEXT,
  author_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category        TEXT DEFAULT 'news' CHECK (category IN ('news','review','list','explained','interview','trailer')),
  tags            TEXT[] DEFAULT '{}',
  published       BOOLEAN DEFAULT FALSE,
  featured        BOOLEAN DEFAULT FALSE,
  views           INTEGER DEFAULT 0,
  reading_time    INTEGER DEFAULT 0,
  seo_title       TEXT,
  seo_description TEXT,
  related_movie_id INTEGER,
  related_tv_id    INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CACHED MOVIE META ───────────────────────────────────────────────────────
-- Optional: cache TMDb data locally for faster SEO rendering
CREATE TABLE IF NOT EXISTS public.movie_cache (
  tmdb_id       INTEGER PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  poster_path   TEXT,
  backdrop_path TEXT,
  overview      TEXT,
  release_date  TEXT,
  vote_average  NUMERIC(4,2),
  genres        JSONB,
  runtime       INTEGER,
  cached_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tv_cache (
  tmdb_id         INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  poster_path     TEXT,
  backdrop_path   TEXT,
  overview        TEXT,
  first_air_date  TEXT,
  vote_average    NUMERIC(4,2),
  genres          JSONB,
  cached_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_watchlists_user   ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user    ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie     ON public.reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tv        ON public.reviews(tv_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user      ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_movie    ON public.comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_tv       ON public.comments(tv_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_articles_slug     ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category  ON public.articles(category);

-- Full-text search on articles
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')));

-- ─── RLS POLICIES ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles       ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read"  ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_own_update"   ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Watchlists: only own
CREATE POLICY "watchlists_own_all"    ON public.watchlists FOR ALL USING (auth.uid() = user_id);

-- Favorites: only own
CREATE POLICY "favorites_own_all"     ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Reviews: public read, auth write
CREATE POLICY "reviews_public_read"   ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_auth_insert"   ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_update"    ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_own_delete"    ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Review likes
CREATE POLICY "review_likes_public_read" ON public.review_likes FOR SELECT USING (TRUE);
CREATE POLICY "review_likes_auth_all"    ON public.review_likes FOR ALL USING (auth.uid() = user_id);

-- Comments: public read, auth write
CREATE POLICY "comments_public_read"  ON public.comments FOR SELECT USING (TRUE);
CREATE POLICY "comments_auth_insert"  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_own_modify"   ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_own_delete"   ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Notifications: only own
CREATE POLICY "notifs_own_all"        ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Articles: published are public
CREATE POLICY "articles_public_read"  ON public.articles FOR SELECT USING (published = TRUE);

-- ─── TRIGGERS ────────────────────────────────────────────────────────────────

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at    BEFORE UPDATE ON public.profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reviews_updated_at     BEFORE UPDATE ON public.reviews    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER comments_updated_at    BEFORE UPDATE ON public.comments   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at    BEFORE UPDATE ON public.articles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update review likes count
CREATE OR REPLACE FUNCTION update_review_likes_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reviews SET likes_count = likes_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reviews SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER review_likes_count_trigger
  AFTER INSERT OR DELETE ON public.review_likes
  FOR EACH ROW EXECUTE FUNCTION update_review_likes_count();
