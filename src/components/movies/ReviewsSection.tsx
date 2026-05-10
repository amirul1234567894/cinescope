'use client'

import { useState } from 'react'
import { MessageSquare, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReviewsSectionProps {
  movieId: number
  type: 'movie' | 'tv'
}

export function ReviewsSection({ movieId, type }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (content.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }
    // In production: POST to /api/reviews with movieId/tvId, rating, content
    toast.success('Review submitted! (login required in production)')
    setShowForm(false)
    setRating(0)
    setContent('')
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-red-500" />
          <h2 className="text-xl font-bold text-white font-display">Reviews</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-glass text-sm"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 mb-4">
          {/* Rating stars */}
          <div className="mb-4">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      n <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/15'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-white/70 self-center">{rating}/10</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Your Review</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about this title..."
              className="search-input w-full rounded-xl px-4 py-3 text-sm resize-none"
            />
            <p className="text-xs text-white/25 mt-1">{content.length}/5000 characters</p>
          </div>

          <button type="submit" className="btn-primary text-sm">Submit Review</button>
        </form>
      )}

      {/* Empty state */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-white/30 text-sm">Be the first to review this title.</p>
      </div>
    </section>
  )
}
