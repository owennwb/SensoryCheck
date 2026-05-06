import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

const styles = {
  nav: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text-primary)',
    textDecoration: 'none',
  },
  logoIcon: {
    width: 30,
    height: 30,
    background: 'var(--accent-blue-bg)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  navBtn: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  primaryBtn: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--accent-blue)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
}

export default function Nav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="#4f8ef7" strokeWidth="1.5" fill="none"/>
            <path d="M5.5 8 Q8 4.5 10.5 8" stroke="#4f8ef7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="1.2" fill="#4f8ef7"/>
          </svg>
        </div>
        SensoryCheck
      </Link>
      <div style={styles.right}>
        {user ? (
          <>
            <button style={styles.navBtn} onClick={() => navigate('/profile')}>My profile</button>
            <button style={styles.navBtn} onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            {location.pathname !== '/auth' && (
              <button style={styles.primaryBtn} onClick={() => navigate('/auth')}>Sign in / Sign up</button>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
