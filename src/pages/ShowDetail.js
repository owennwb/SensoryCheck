import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { CATEGORIES, FullBars, IntensityBadge, getColor, avgRatingsObj } from '../components/SensoryBars'

const s = {
  back: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none', marginBottom: 18, padding: 0, fontFamily: 'inherit' },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 },
  venue: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  reviewsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  addBtn: { padding: '7px 14px', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  reviewCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 10 },
  reviewMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewer: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
  reviewDate: { fontSize: 11, color: 'var(--text-muted)' },
  sectionBadge: { display: 'inline-block', fontSize: 11, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '2px 9px', borderRadius: 99, marginBottom: 8 },
  reviewText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 },
  miniRatings: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  miniRatingPill: (val) => ({ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'var(--bg-secondary)', color: getColor(val), fontWeight: 500 }),
  formCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16 },
  formTitle: { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 5, display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' },
  textarea: { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 90 },
  sliderRow: { marginBottom: 12 },
  sliderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  sliderName: { fontSize: 12, color: 'var(--text-secondary)' },
  sliderVal: (val) => ({ fontSize: 12, fontWeight: 600, color: getColor(val) }),
  submitBtn: { width: '100%', padding: '10px', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  successMsg: { background: 'var(--color-medium-bg)', color: 'var(--color-medium)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 14 },
  signInPrompt: { background: 'var(--accent-blue-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center' },
  signInText: { fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 },
  signInBtn: { padding: '8px 20px', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: 14 },
  avgBadgeRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
}

const defaultSliders = () => Object.fromEntries(CATEGORIES.map(c => [c.toLowerCase(), 5]))

export default function ShowDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRatings, setAvgRatings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [sliders, setSliders] = useState(defaultSliders())
  const [section, setSection] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchData() }, [id])

  async function fetchData() {
    const [showRes, reviewRes] = await Promise.all([
      supabase.from('shows').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*, ratings(*)').eq('show_id', id).order('created_at', { ascending: false })
    ])
    if (showRes.data) setShow(showRes.data)
    if (reviewRes.data) {
      setReviews(reviewRes.data)
      computeAvg(reviewRes.data)
    }
    setLoading(false)
  }

  function computeAvg(reviews) {
    if (!reviews.length) return
    const hasRatings = reviews.filter(r => r.ratings)
    if (!hasRatings.length) return
    const avg = {}
    CATEGORIES.forEach(cat => {
      const key = cat.toLowerCase()
      avg[key] = Math.round(hasRatings.reduce((a, r) => a + (r.ratings?.[key] || 0), 0) / hasRatings.length)
    })
    setAvgRatings(avg)
  }

  async function handleSubmit() {
    if (!reviewText.trim()) { setError('Please write a review.'); return }
    setSubmitting(true)
    setError('')
    const { data: review, error: rErr } = await supabase
      .from('reviews')
      .insert({ show_id: id, user_id: user.id, section: section || 'Not specified', body: reviewText })
      .select().single()
    if (rErr) { setError('Something went wrong. Please try again.'); setSubmitting(false); return }
    await supabase.from('ratings').insert({ review_id: review.id, show_id: id, user_id: user.id, ...sliders })
    setSuccess(true)
    setShowForm(false)
    setReviewText('')
    setSection('')
    setSliders(defaultSliders())
    fetchData()
    setSubmitting(false)
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading...</div>
  if (!show) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Show not found.</div>

  const overallAvg = avgRatings ? avgRatingsObj(avgRatings) : 0

  return (
    <div>
      <button style={s.back} onClick={() => navigate('/')}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2L3 6.5l5 4.5"/></svg>
        Back to browse
      </button>

      <div style={s.card}>
        <h1 style={s.title}>{show.name}</h1>
        <div style={s.venue}>{show.venue}</div>
        {avgRatings ? (
          <>
            <div style={s.avgBadgeRow}>
              <IntensityBadge avg={overallAvg} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall sensory intensity · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
            <FullBars ratings={avgRatings} />
          </>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No ratings yet — be the first to review!</div>
        )}
      </div>

      {success && <div style={s.successMsg}>Review submitted! Thank you for helping the community.</div>}

      <div style={s.reviewsHeader}>
        <div style={s.sectionLabel}>Community reviews ({reviews.length})</div>
        {user && !showForm && <button style={s.addBtn} onClick={() => setShowForm(true)}>+ Add review</button>}
      </div>

      {showForm && (
        <div style={s.formCard}>
          <div style={s.formTitle}>Your sensory review</div>
          <div style={s.formGroup}>
            <label style={s.label}>Seating section (optional)</label>
            <input style={s.input} value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. Arena barrier row 1, Section B" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...s.label, marginBottom: 12 }}>Rate each category (1 = mild, 10 = extreme)</div>
            {CATEGORIES.map(cat => {
              const key = cat.toLowerCase()
              const val = sliders[key]
              return (
                <div key={cat} style={s.sliderRow}>
                  <div style={s.sliderHeader}>
                    <span style={s.sliderName}>{cat}</span>
                    <span style={s.sliderVal(val)}>{val}/10</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" value={val}
                    onChange={e => setSliders(prev => ({ ...prev, [key]: parseInt(e.target.value) }))} />
                </div>
              )
            })}
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Your experience</label>
            <textarea style={s.textarea} value={reviewText} onChange={e => setReviewText(e.target.value)}
              placeholder="Describe the sensory experience in detail — what was overwhelming, what was manageable, what you wish you'd known..." />
          </div>
          {error && <div style={{ fontSize: 13, color: 'var(--color-extreme)', marginBottom: 10 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...s.submitBtn, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', flex: '0 0 auto', width: 'auto', padding: '10px 16px' }}
              onClick={() => setShowForm(false)}>Cancel</button>
            <button style={s.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </div>
        </div>
      )}

      {!user && (
        <div style={s.signInPrompt}>
          <div style={s.signInText}>Sign in to share your sensory experience and help others.</div>
          <button style={s.signInBtn} onClick={() => navigate('/auth')}>Sign in or create account</button>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={s.empty}>No reviews yet. Be the first!</div>
      ) : reviews.map(review => (
        <div key={review.id} style={s.reviewCard}>
          <div style={s.reviewMeta}>
            <span style={s.reviewer}>{review.display_name || 'Anonymous'}</span>
            <span style={s.reviewDate}>{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div style={s.sectionBadge}>Section: {review.section}</div>
          <p style={s.reviewText}>{review.body}</p>
          {review.ratings && (
            <div style={s.miniRatings}>
              {CATEGORIES.map(cat => {
                const key = cat.toLowerCase()
                const val = review.ratings[key]
                return <span key={cat} style={s.miniRatingPill(val)}>{cat} {val}</span>
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
