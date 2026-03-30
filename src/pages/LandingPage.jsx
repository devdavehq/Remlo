import { useState } from 'react'
import { Link } from 'react-router-dom'

import RemloBrand from '../components/RemloBrand'

function joinWaitlist(email, onSuccess, onErrorBorder) {
  if (email && email.includes('@')) {
    onSuccess()
  } else {
    onErrorBorder()
  }
}

export default function LandingPage() {
  const [heroEmail, setHeroEmail] = useState('')
  const [heroOk, setHeroOk] = useState(false)
  const [heroErr, setHeroErr] = useState(false)
  const [ctaEmail, setCtaEmail] = useState('')
  const [ctaOk, setCtaOk] = useState(false)
  const [ctaErr, setCtaErr] = useState(false)

  return (
    <div className="lp-page">
      <nav className="lp-nav">
        <div className="lp-logo">
          <RemloBrand size={120} onClickCycle />
        </div>
        <div className="lp-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#for-who">For who</a>
          <Link to="/login" className="lp-btn-outline">
            Log in
          </Link>
          <Link to="/signup" className="lp-btn-primary">
            Join waitlist
          </Link>
        </div>
      </nav>

      <div className="lp-hero">
        <div className="lp-hero-badge">Now accepting early access</div>
        <h1>
          Payroll for Nigerian businesses that don&apos;t have an <em>HR department</em>
        </h1>
        <p>
          Set up your ranks once. Add your team. Pay everyone in three clicks. No complexity, no configuration — just payroll
          that works.
        </p>
        {!heroOk ? (
          <form
            className="lp-waitlist-form"
            onSubmit={(e) => {
              e.preventDefault()
              joinWaitlist(
                heroEmail,
                () => setHeroOk(true),
                () => {
                  setHeroErr(true)
                  setTimeout(() => setHeroErr(false), 1200)
                }
              )
            }}
          >
            <input
              type="email"
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              placeholder="Enter your work email"
              style={heroErr ? { borderColor: '#e24b4a' } : undefined}
            />
            <button type="submit" className="lp-btn-primary">
              Get early access
            </button>
          </form>
        ) : (
          <div className="lp-submitted" role="status">
            You&apos;re on the list. We&apos;ll reach out when your spot is ready.
          </div>
        )}
        <div className="lp-hero-sub">Free for your first 3 months. No credit card needed.</div>
        <div className="lp-hero-count">
          <div className="lp-avatars">
            <div className="lp-av">AB</div>
            <div className="lp-av lp-av-b">CO</div>
            <div className="lp-av lp-av-c">NK</div>
            <div className="lp-av">FE</div>
          </div>
          <span className="lp-muted-small">47 businesses already on the waitlist</span>
        </div>
      </div>

      <div className="lp-section">
        <div className="lp-inner">
          <div className="lp-section-label">The problem</div>
          <h2>Payday shouldn&apos;t be this stressful</h2>
          <p>
            Most Nigerian businesses under 200 staff are still running payroll from Excel or doing bank transfers one by one.
            Existing tools are built for HR professionals — not you.
          </p>
          <div className="lp-pain-grid">
            <div className="lp-pain-card">
              <div className="lp-pain-icon" style={{ background: '#fcebeb' }} />
              <div className="lp-pain-title">Manual bank transfers</div>
              <div className="lp-pain-desc">
                Sending payments one by one to 50+ employees every month — one wrong account number breaks everything
              </div>
            </div>
            <div className="lp-pain-card">
              <div className="lp-pain-icon" style={{ background: '#faeeda' }} />
              <div className="lp-pain-title">Complex HR software</div>
              <div className="lp-pain-desc">
                Tools like PaidHR and Sage require hours of setup and HR expertise before you can send your first payment
              </div>
            </div>
            <div className="lp-pain-card">
              <div className="lp-pain-icon" style={{ background: '#e6f1fb' }} />
              <div className="lp-pain-title">Compliance guesswork</div>
              <div className="lp-pain-desc">
                PAYE, pension, NHF — most small businesses either get it wrong or ignore it and hope for the best
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-section" id="how-it-works">
        <div className="lp-inner">
          <div className="lp-section-label">How it works</div>
          <h2>From signup to first payment in under 15 minutes</h2>
          <p>Designed for the office manager, the founder, the admin — not an HR professional.</p>
          <div className="lp-steps">
            {[
              {
                title: 'Create your account',
                body: 'Enter your company name and email. No configuration required upfront — just sign up and go in.',
              },
              {
                title: 'Set up your ranks',
                body: 'Define your staff tiers once — Junior, Senior, Manager, whatever you call them. Assign a salary to each rank. Done.',
              },
              {
                title: 'Add your employees',
                body: "Import from Excel or add one by one. Each employee inherits their rank's salary — you only adjust exceptions.",
              },
              {
                title: 'Pay everyone',
                body: "Click New payment run. Preview who gets what. Click send. Every employee receives an SMS confirmation. That's it.",
              },
            ].map(({ title, body }, i) => (
              <div key={title} className="lp-step-row">
                <div className="lp-step-num">{i + 1}</div>
                <div className="lp-step-body">
                  <strong>{title}</strong>
                  <span>{body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-section" id="for-who">
        <div className="lp-inner">
          <div className="lp-section-label">Built for</div>
          <h2>Any Nigerian organisation with a payroll to run</h2>
          <p style={{ marginBottom: 16 }}>If you have staff of different levels and need to pay them reliably every month, Remlo is for you.</p>
          <div className="lp-who-grid">
            {[
              ['Schools & universities', 'Teaching staff, support staff, admin — different levels, one clean run'],
              ['Clinics & hospitals', 'Doctors, nurses, cleaners — tiered payroll in minutes not hours'],
              ['NGOs & nonprofits', 'Donor-funded orgs that need clean audit trails and compliance records'],
              ['Construction firms', 'Site workers, supervisors, engineers — pay the right amount to the right person'],
              ['Logistics companies', 'Drivers, dispatchers, management — bulk payment to any Nigerian bank'],
              ['SMEs & startups', "Growing teams that have outgrown Excel but don't want enterprise software"],
            ].map(([t, d]) => (
              <div key={t} className="lp-who-card">
                <div className="lp-who-title">{t}</div>
                <div className="lp-who-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-section" id="pricing">
        <div className="lp-inner">
          <div className="lp-section-label">Pricing</div>
          <h2>Simple pricing, no surprises</h2>
          <p style={{ marginBottom: 16 }}>Start free. Upgrade only when you need to.</p>
          <div className="lp-pricing-grid">
            <div className="lp-price-card">
              <div className="lp-price-name">Starter</div>
              <div className="lp-price-amount">Free</div>
              <div className="lp-price-desc">For small teams getting started</div>
              <div className="lp-price-features">
                {['Up to 10 employees', 'Unlimited payment runs', 'All Nigerian banks supported', 'SMS notifications'].map((x) => (
                  <div key={x} className="lp-pf">
                    <div className="lp-pf-dot" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-price-card lp-featured">
              <div className="lp-price-badge">Most popular</div>
              <div className="lp-price-name">Growth</div>
              <div className="lp-price-amount">
                ₦15,000<span>/month</span>
              </div>
              <div className="lp-price-desc">For growing businesses</div>
              <div className="lp-price-features">
                {['Up to 50 employees', 'Approval workflows', 'PAYE + pension reports', 'Payslip generation', 'Team member invites'].map((x) => (
                  <div key={x} className="lp-pf">
                    <div className="lp-pf-dot" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-price-card">
              <div className="lp-price-name">Business</div>
              <div className="lp-price-amount">
                ₦35,000<span>/month</span>
              </div>
              <div className="lp-price-desc">For larger organisations</div>
              <div className="lp-price-features">
                {['Up to 200 employees', 'Multi-level approvals', 'Full audit log export', 'NHF compliance reports', 'Priority support'].map((x) => (
                  <div key={x} className="lp-pf">
                    <div className="lp-pf-dot" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-bottom-cta">
        <h2>Ready to make payday stress-free?</h2>
        <p>Join the waitlist. Free for your first 3 months.</p>
        {!ctaOk ? (
          <form
            className="lp-waitlist-form lp-waitlist-form--center"
            onSubmit={(e) => {
              e.preventDefault()
              joinWaitlist(
                ctaEmail,
                () => setCtaOk(true),
                () => {
                  setCtaErr(true)
                  setTimeout(() => setCtaErr(false), 1200)
                }
              )
            }}
          >
            <input
              type="email"
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              placeholder="Your work email"
              style={ctaErr ? { borderColor: '#e24b4a' } : undefined}
            />
            <button type="submit" className="lp-btn-primary">
              Join waitlist
            </button>
          </form>
        ) : (
          <div className="lp-submitted" role="status">
            You&apos;re on the list. We&apos;ll reach out when your spot is ready.
          </div>
        )}
      </div>

      <div className="lp-footer">
        <div className="lp-footer-logo">
          <RemloBrand size={110} onClickCycle={false} />
        </div>
        <div className="lp-footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
        <div className="lp-footer-loc">Lagos, Nigeria</div>
      </div>
    </div>
  )
}
