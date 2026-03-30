import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import RemloBrand from '../components/RemloBrand'
import { useToast } from '../toast/useToast'

const industries = [
  'Banking & Finance',
  'Education',
  'Healthcare',
  'NGO / Non-profit',
  'Construction & Real estate',
  'Logistics & Transport',
  'Technology',
  'Retail & FMCG',
  'Other',
]

export default function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { addToast } = useToast()

  function onSubmit(e) {
    e.preventDefault()
    if (step === 1) setStep(2)
    else setStep(3)
  }

  if (step === 3) {
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
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Account created</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                Check your email to verify, then finish ranks and approvals in Settings — no extra steps here.
              </p>
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto', padding: '9px 24px' }}
                onClick={() => {
                  addToast('Account created', 'success')
                  navigate('/dashboard')
                }}
              >
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
      <div className="auth-wrap wide">
        <div className="signup-split">
          <aside className="signup-left">
            <div className="brand">
              <RemloBrand size={140} onClickCycle={false} />
            </div>
            <p className="tag">Payroll for Nigerian teams — matte, calm, and built for approvals.</p>
            <div className="step-list">
              <div className="step-item">
                <div className={`step-num${step === 1 ? ' active' : ' done'}`}>{step > 1 ? '✓' : '1'}</div>
                <div className={`step-label${step === 1 ? ' active' : ' done'}`}>Company</div>
              </div>
              <div className="step-item">
                <div className={`step-num${step === 2 ? ' active' : step < 2 ? ' wait' : ' done'}`}>
                  {step > 2 ? '✓' : '2'}
                </div>
                <div className={`step-label${step === 2 ? ' active' : step < 2 ? ' wait' : ' done'}`}>Your account</div>
              </div>
            </div>
          </aside>

          <div className="signup-right">
            {step === 1 && (
              <form onSubmit={onSubmit}>
                <div className="step-title">Company details</div>
                <p className="step-desc">From PayStaff-style onboarding — we only need the basics now.</p>
                <div className="field">
                  <label htmlFor="co">Company name</label>
                  <input id="co" placeholder="e.g. Bright Future Academy" />
                </div>
                <div className="field">
                  <label htmlFor="ind">Industry</label>
                  <select id="ind" defaultValue="">
                    <option value="" disabled>
                      Select industry…
                    </option>
                    {industries.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-grid-2">
                  <div className="field">
                    <label htmlFor="size">Company size</label>
                    <select id="size" defaultValue="51-200">
                      <option>1–10 employees</option>
                      <option>11–50 employees</option>
                      <option>51–200 employees</option>
                      <option>200+ employees</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="rc">RC number (optional)</label>
                    <input id="rc" placeholder="RC-123456" />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Continue →
                </button>
                <p className="link-row">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={onSubmit}>
                <div className="step-title">Create your admin account</div>
                <p className="step-desc">From Remlo — quick account step; ranks & deductions live in the dashboard.</p>
                <div className="field-grid-2">
                  <div className="field">
                    <label htmlFor="fn">First name</label>
                    <input id="fn" placeholder="Ngozi" />
                  </div>
                  <div className="field">
                    <label htmlFor="ln">Last name</label>
                    <input id="ln" placeholder="Adeyemi" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="em">Work email</label>
                  <input id="em" type="email" placeholder="ngozi@company.com" />
                </div>
                <div className="field">
                  <label htmlFor="ph">Phone</label>
                  <input id="ph" type="tel" placeholder="+234 801 234 5678" />
                </div>
                <div className="field-grid-2">
                  <div className="field">
                    <label htmlFor="pw1">Password</label>
                    <input id="pw1" type="password" placeholder="Min. 8 characters" />
                  </div>
                  <div className="field">
                    <label htmlFor="pw2">Confirm password</label>
                    <input id="pw2" type="password" placeholder="Repeat" />
                  </div>
                </div>
                <div className="info-box">
                  You&apos;ll configure employee ranks, statutory deductions, and approval chains under Settings after signup — same as the streamlined Remlo flow.
                </div>
                <div className="btn-row">
                  <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn-primary">
                    Create account →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
