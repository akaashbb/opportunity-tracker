'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else window.location.href = '/dashboard'
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) setError(error.message)
      else setMessage('Password reset email sent! Check your inbox.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 10, padding: 8, display: 'flex' }}>
              <TrendingUp size={22} color="white" />
            </div>
          </div>
          <h1>OpportunityPro</h1>
          <p>Sales Pipeline & Deal Tracker</p>
        </div>

        <h2 className="login-title">
          {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
        </h2>
        <p className="login-sub">
          {mode === 'login' ? 'Sign in to access your dashboard' :
           mode === 'signup' ? 'Get started with OpportunityPro' :
           'Enter your email to receive a reset link'}
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}
        {message && <div className="alert alert-success">✓ {message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" type="text" placeholder="Akash Kumar"
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="form-control" type="email" placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                style={{ paddingLeft: 32 }} />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input className="form-control" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  style={{ paddingLeft: 32, paddingRight: 38 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2 }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -6 }}>
              <button type="button" className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
                onClick={() => { setMode('forgot'); setError(''); setMessage('') }}>
                Forgot password?
              </button>
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: 4, fontSize: 14 }}>
            {loading ? <span className="spinner" /> :
              mode === 'login' ? <><ArrowRight size={15}/> Sign In</> :
              mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0 16px' }} />

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>Don&apos;t have an account? <button className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => { setMode('signup'); setError(''); setMessage('') }}>Sign up</button></>
          ) : (
            <>Already have an account? <button className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => { setMode('login'); setError(''); setMessage('') }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  )
}
