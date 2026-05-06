import React, { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Nav from './components/Nav'
import Browse from './pages/Browse'
import ShowDetail from './pages/ShowDetail'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)', fontSize: 14 }}>
      Loading SensoryCheck...
    </div>
  )

  return (
    <AuthContext.Provider value={{ user }}>
      <Nav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/show/:id" element={<ShowDetail />} />
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}
