import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { CATEGORIES, getColor } from '../components/SensoryBars'

const SENSITIVITIES = ['Noise', 'Strobes', 'Pyrotechnics', 'Strong smells', 'Crowds', 'Temperature', 'Visual chaos', 'Autism / SPD', 'Epilepsy', 'Anxiety']

const s = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: '50%', background: 'var(--accent-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--accent-blue-text)', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 },
  email: { fontSize: 13, color: 'var(--text-secondary)' },
  statRow: { display: 'flex', gap: 12, marginTop: 16 },
  statBox: { flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px 16px', textAlign: 'center' },
  statNum: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' },
  statLbl: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: (active) => ({
    padding: '5px 14px', borderRadius: 99,
    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
    background: active ? 'var(--color-extreme-bg)' : 'transparent',
    color: active ? 'var(--color-extreme)' : 'var(--text-secondary)',
    fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.15s',
  }),
  reviewCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 10, cursor: 'pointer' },
  reviewTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 },
  reviewDate: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 },
  reviewBody: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 },
  miniPills: { display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 },
  pill: (val) => ({ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'var(--bg-secondary)', color: getColor(val), fontWeight: 500 }),
  empty: { textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: 14 },
  saveBtn: { padding: '7px 16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 14 },
  saved: { fontSize: 12, color: 'var(--color-medium)', marginTop: 10 },
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [sensitivities, setSensitivities] = useState([])
  const [savedSens, setSavedSens] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [reviewRes, profileRes] = await Promise.all([
      supabase.from('reviews').select('*, shows(name, venue), ratings(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('sensitivities').eq('id', user.id).single()
    ])
    if (reviewRes.data) setReviews(reviewRes.data)
    if (profileRes.data?.sensitivities) setSensitivities(profileRes.data.sensitivities)
    setLoading(false)
  }

  function toggleSens(s) {
    setSensitivities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    setSavedSens(false)
  }

  async function saveSensitivities() {
    await supabase.from('profiles').upsert({ id: user.id, sensitivities })
    setSavedSens(true)
  }

  const initials = (user.user_metadata?.display_name || user.email || '?').slice(0, 2).toUpperCase()
  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

  return (
    <div>
      <div style={s.card}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.name}>{displayName}</div>
        <div style={s.email}>{user.email}</div>
        <div style={s.statRow}>
          <div style={s.statBox}><div style={s.statNum}>{reviews.length}</div><div style={s.statLbl}>Reviews</div></div>
          <div style={s.statBox}><div style={s.statNum}>{sensitivities.length}</div><div style={s.statLbl}>Sensitivities</div></div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.sectionLabel}>My sensory sensitivities</div>
        <div style={s.chips}>
          {SENSITIVITIES.map(sens => (
            <button key={sens} style={s.chip(sensitivities.includes(sens))} onClick={() => toggleSens(sens)}>{sens}</button>
          ))}
        </div>
        <button style={s.saveBtn} onClick={saveSensitivities}>Save sensitivities</button>
        {savedSens && <div style={s.saved}>Saved!</div>}
      </div>

      <div style={s.sectionLabel}>My reviews</div>
      {loading ? <div style={s.empty}>Loading...</div> : reviews.length === 0 ? (
        <div style={s.empty}>No reviews yet. Browse shows to add your first review.</div>
      ) : reviews.map(review => (
        <div key={review.id} style={s.reviewCard} onClick={() => navigate(`/show/${review.show_id}`)}>
          <div style={s.reviewTitle}>{review.shows?.name || 'Unknown show'}</div>
          <div style={s.reviewDate}>{review.shows?.venue} · {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
          <div style={s.reviewBody}>{review.body}</div>
          {review.ratings && (
            <div style={s.miniPills}>
              {CATEGORIES.map(cat => {
                const val = review.ratings[cat.toLowerCase()]
                return <span key={cat} style={s.pill(val)}>{cat} {val}</span>
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
