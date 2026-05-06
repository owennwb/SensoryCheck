import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MiniBars, IntensityBadge, avgRatingsObj } from '../components/SensoryBars'

const s = {
  searchWrap: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: 14,
    color: 'var(--text-primary)',
    outline: 'none',
  },
  filterRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  chip: (active) => ({
    padding: '5px 14px',
    borderRadius: 99,
    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
    background: active ? 'var(--accent-blue-bg)' : 'transparent',
    color: active ? 'var(--accent-blue-text)' : 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 16,
    marginBottom: 12,
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  showName: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 },
  venueName: { fontSize: 12, color: 'var(--text-secondary)' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
  },
  reviewCount: { fontSize: 12, color: 'var(--text-muted)' },
  addBtn: {
    padding: '7px 16px',
    background: 'var(--accent-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: 14 },
  hero: { marginBottom: 28 },
  heroTitle: { fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 },
}

export default function Browse() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchShows()
  }, [])

  async function fetchShows() {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.log('error', error)
  if (!error) setShows(data || [])
  setLoading(false)
}

  function getAvg(show) {
    if (!show.avg_ratings?.length) return 0
    const r = show.avg_ratings[0]
    return ['noise','strobes','pyro','smell','crowd','temp','visual'].reduce((a,k)=>a+(r[k]||0),0)/7
  }

  const filtered = shows.filter(show => {
    const q = query.toLowerCase()
    const matchQ = !q || show.name.toLowerCase().includes(q) || show.venue.toLowerCase().includes(q)
    const avg = getAvg(show)
    const matchF =
      filter === 'all' ||
      (filter === 'extreme' && avg >= 8) ||
      (filter === 'high' && avg >= 6 && avg < 8) ||
      (filter === 'medium' && avg >= 4 && avg < 6) ||
      (filter === 'low' && avg < 4)
    return matchQ && matchF
  })

  return (
    <div>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>SensoryCheck</h1>
        <p style={s.heroSub}>Community sensory ratings for live shows and venues.<br/>Find out what to expect before you book — noise, pyro, strobes, crowd and more.</p>
      </div>

      <div style={s.searchWrap}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5l3 3" strokeLinecap="round"/>
        </svg>
        <input style={s.searchInput} placeholder="Search shows or venues..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div style={s.filterRow}>
        {['all','extreme','high','medium','low'].map(f => (
          <button key={f} style={s.chip(filter===f)} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={s.sectionLabel}>Shows & venues ({filtered.length})</div>

      {loading ? <div style={s.empty}>Loading...</div> : filtered.length === 0 ? (
        <div style={s.empty}>No shows found. Be the first to add one!</div>
      ) : filtered.map(show => {
        const avg = getAvg(show)
        const ratingsObj = show.avg_ratings?.[0] || {}
        const count = show.review_count?.[0]?.count || 0
        return (
          <div key={show.id} style={s.card}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-hover)'; e.currentTarget.style.background='var(--bg-card-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-card)' }}
            onClick={() => navigate(`/show/${show.id}`)}>
            <div style={s.cardHeader}>
              <div>
                <div style={s.showName}>{show.name}</div>
                <div style={s.venueName}>{show.venue}</div>
              </div>
              <IntensityBadge avg={avg} />
            </div>
            <MiniBars ratings={ratingsObj} />
            <div style={s.cardFooter}>
              <span style={s.reviewCount}>{count} review{count !== 1 ? 's' : ''}</span>
              <button style={s.addBtn} onClick={e => { e.stopPropagation(); navigate(`/show/${show.id}`) }}>View &amp; review →</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
