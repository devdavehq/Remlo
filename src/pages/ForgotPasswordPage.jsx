import { useState } from 'react'
import { Link } from 'react-router-dom'

import RemloBrand from '../components/RemloBrand'
import { useToast } from '../toast/useToast'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { addToast } = useToast()

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-wrap">
          <div className="auth-card">
            <div className="success-box">
              <div className="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 10l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Check your email</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                We sent a reset link. It expires in one hour.
              </p>
              <Link to="/login" style={{ fontSize: 12 }}>
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
              <RemloBrand size={140} onClickCycle={false} />
          </div>
          <p className="auth-sub">Reset your password</p>
          <div className="info-box">Enter your work email and we&apos;ll send a reset link (Remlo-style flow — no backend in this demo).</div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addToast('Password reset link sent', 'success')
              setSent(true)
            }}
          >
            <div className="field">
              <label htmlFor="fe">Work email</label>
              <input id="fe" type="email" placeholder="you@company.com" />
            </div>
            <button type="submit" className="btn-primary">
              Send reset link →
            </button>
            <Link to="/login" className="btn-ghost">
              ← Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
