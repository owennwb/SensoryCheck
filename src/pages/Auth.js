import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const s = {
  wrap: { maxWidth: 400, margin: '40px auto' },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28 },
  title: { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 },
  sub: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 },
  tabs: { display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 4 },
  tab: (active) => ({
    flex: 1, padding: '7px 0', textAlign: 'center', borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--bg-card)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    fontSize: 13, fontWeight: active ? 600 : 400, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.15s',
  }),
  formGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 5, display: 'block' },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)',
    color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%', padding: 11, background: 'var(--accent-blue)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', marginTop: 8, fontFamily: 'inherit',
  },
  error: { fontSize: 13, color: 'var(--color-extreme)', marginBottom: 12, padding: '8px 12px', background: 'var(--color-extreme-bg)', borderRadius: 'var(--radius-md)' },
  success: { fontSize: 13, color: 'var(--color-medium)', marginBottom: 12, padding: '8px 12px', background: 'var(--color-medium-bg)', borderRadius: 'var(--radius-md)' },
}

export default function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError(''); setSuccess(''); setLoading(true)
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { display_name: displayName || email.split('@')[0] } }
      })
      if (error) setError(error.message)
      else setSuccess('Account created! Check your email to confirm, then sign in.')
    }
    setLoading(false)
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>SensoryCheck</div>
        <div style={s.sub}>Help the community by sharing your sensory experience at shows and venues.</div>
        <div style={s.tabs}>
          <button style={s.tab(mode==='signin')} onClick={() => { setMode('signin'); setError(''); setSuccess('') }}>Sign in</button>
          <button style={s.tab(mode==='signup')} onClick={() => { setMode('signup'); setError(''); setSuccess('') }}>Create account</button>
        </div>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        {mode === 'signup' && (
          <div style={s.formGroup}>
            <label style={s.label}>Display name</label>
            <input style={s.input} type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How you'll appear on reviews" />
          </div>
        )}
        <div style={s.formGroup}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </div>
    </div>
  )
}
