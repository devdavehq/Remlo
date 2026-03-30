import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import RemloBrand from '../components/RemloBrand'
import { useToast } from '../toast/useToast'

export default function InvitePage() {
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const { addToast } = useToast()

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-wrap">
          <div className="auth-card">
            <div className="success-box">
              <div className="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12l5 5 9-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>You&apos;re in</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                You now have Finance Officer access to the demo company account.
              </p>
              <button type="button" className="btn-primary" style={{ width: 'auto', padding: '9px 24px' }} onClick={() => navigate('/dashboard')}>
                Go to dashboard →
              </button>
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
          <p className="auth-sub">You&apos;ve been invited</p>
          <div className="invite-banner">
            <div className="invite-icon">NA</div>
            <div className="invite-text">
              <strong>Ngozi Adeyemi invited you</strong>
              <span>To manage payroll for First Bank Nigeria as Finance Officer</span>
            </div>
          </div>
          <div className="info-box">Your email and company are already set. Create a password to join (Remlo-style invite).</div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addToast('Invite accepted — you’re now in the workspace', 'success')
              setDone(true)
            }}
          >
            <div className="field">
              <label>Your email (read-only)</label>
              <input value="chidi@firstbank.com" readOnly style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="field">
              <label>Your role</label>
              <input value="Finance Officer" readOnly style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="field-grid-2">
              <div className="field">
                <label htmlFor="p1">Create password</label>
                <input id="p1" type="password" placeholder="Min. 8 characters" />
              </div>
              <div className="field">
                <label htmlFor="p2">Confirm password</label>
                <input id="p2" type="password" placeholder="Repeat" />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Accept & join →
            </button>
          </form>
          <p className="link-row" style={{ marginTop: 0 }}>
            Invite expires in 48 hours. <span style={{ color: 'var(--text-muted)' }}>Resend</span> (demo)
          </p>
        </div>
      </div>
    </div>
  )
}
