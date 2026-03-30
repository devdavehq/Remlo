import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import RemloBrand from '../components/RemloBrand'
import { useToast } from '../toast/useToast'

const roles = [
  { key: 'admin', name: 'Admin', hint: 'Full access' },
  { key: 'finance', name: 'Finance', hint: 'Approve runs' },
  { key: 'hr', name: 'HR', hint: 'Manage staff' },
  { key: 'viewer', name: 'Viewer', hint: 'Read only' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('admin')
  const { addToast } = useToast()

  function handleSignIn(e) {
    e.preventDefault()
    addToast('Signed in successfully', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <RemloBrand size={140} onClickCycle={false} />
          </div>
          <p className="auth-sub">Sign in to your payroll workspace</p>

          <form onSubmit={handleSignIn}>
            <div className="field">
              <label htmlFor="email">Work email</label>
              <input id="email" type="email" autoComplete="username" placeholder="you@company.com" />
            </div>
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input id="pw" type="password" autoComplete="current-password" placeholder="••••••••" />
            </div>
            <div style={{ textAlign: 'right', margin: '-4px 0 10px' }}>
              <Link to="/forgot" style={{ fontSize: 11 }}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="btn-primary">
              Sign in
            </button>
          </form>

          <div className="divider">or sign in as</div>
          <div className="role-grid">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`role-opt${role === r.key ? ' sel' : ''}`}
                onClick={() => setRole(r.key)}
              >
                <strong>{r.name}</strong>
                <span>{r.hint}</span>
              </button>
            ))}
          </div>

          <p className="link-row">
            No account?{' '}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
