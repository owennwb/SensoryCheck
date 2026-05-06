import React from 'react'

export const CATEGORIES = ['Noise', 'Strobes', 'Pyro', 'Smell', 'Crowd', 'Temp', 'Visual']

export function getColor(val) {
  if (val >= 8) return '#e05555'
  if (val >= 6) return '#e09040'
  if (val >= 4) return '#5bb870'
  return '#4fa8d5'
}

export function getIntensityLabel(avg) {
  if (avg >= 8) return { label: 'Extreme', color: 'var(--color-extreme)', bg: 'var(--color-extreme-bg)' }
  if (avg >= 6) return { label: 'High', color: 'var(--color-high)', bg: 'var(--color-high-bg)' }
  if (avg >= 4) return { label: 'Medium', color: 'var(--color-medium)', bg: 'var(--color-medium-bg)' }
  return { label: 'Low', color: 'var(--color-low)', bg: 'var(--color-low-bg)' }
}

export function avgOf(ratings) {
  if (!ratings || !ratings.length) return 0
  const keys = CATEGORIES.map(c => c.toLowerCase())
  let total = 0, count = 0
  keys.forEach(k => {
    if (ratings[0]?.[k] !== undefined) { total += ratings[0][k]; count++ }
  })
  return count ? total / count : 0
}

export function avgRatingsObj(obj) {
  if (!obj) return 0
  const vals = CATEGORIES.map(c => obj[c.toLowerCase()] || 0)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function MiniBars({ ratings }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {CATEGORIES.map(cat => {
        const val = ratings?.[cat.toLowerCase()] || 0
        return (
          <div key={cat} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{cat}</span>
            <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${val * 10}%`, height: '100%', background: getColor(val), borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)' }}>{val}</span>
          </div>
        )
      })}
    </div>
  )
}

export function FullBars({ ratings }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {CATEGORIES.map(cat => {
        const val = ratings?.[cat.toLowerCase()] || 0
        return (
          <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{val}/10</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${val * 10}%`, height: '100%', background: getColor(val), borderRadius: 3 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function IntensityBadge({ avg }) {
  const { label, color, bg } = getIntensityLabel(avg)
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 9px',
      borderRadius: 99, background: bg, color,
      letterSpacing: '0.04em', textTransform: 'uppercase'
    }}>{label}</span>
  )
}
