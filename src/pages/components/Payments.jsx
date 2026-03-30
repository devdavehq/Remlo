import { useMemo, useState } from 'react'
import { useToast } from '../../toast/useToast'

function formatNaira(value) {
  const n = Number(value) || 0
  return `₦${n.toLocaleString('en-NG')}`
}

export function PaymentHistory() {
  return (
    <>
      <div className="run-card">
        <div className="rc-h">
          <div className="rc-t">March 2025 — Salary run</div>
          <span className="sb sb-ok">Completed</span>
        </div>
        <div className="rc-m">
          <span>63 employees</span>
          <span>₦12,400,000</span>
          <span>Mar 27 · direct</span>
        </div>
      </div>
      <div className="run-card">
        <div className="rc-h">
          <div className="rc-t">March 2025 — Bonus run</div>
          <span className="sb sb-pend">Pending approval</span>
        </div>
        <div className="rc-m">
          <span>18 employees</span>
          <span>₦1,800,000</span>
          <span>Today 9:10am</span>
        </div>
      </div>
      <div className="run-card">
        <div className="rc-h">
          <div className="rc-t">February 2025 — Salary run</div>
          <span className="sb sb-ok">Completed</span>
        </div>
        <div className="rc-m">
          <span>61 employees</span>
          <span>₦11,900,000</span>
          <span>Feb 26</span>
        </div>
      </div>
    </>
  )
}

export function NewPaymentRun({ runStep, setRunStep, go, employees, walletBalance, approvalOn }) {
  return <PaymentTabs runStep={runStep} setRunStep={setRunStep} go={go} employees={employees} walletBalance={walletBalance} approvalOn={approvalOn} />
}

function PaymentTabs({ runStep, setRunStep, go, employees, walletBalance, approvalOn }) {
  const { addToast } = useToast()
  const activeEmployees = useMemo(() => employees.filter((e) => e.active), [employees])
  const availableRanks = useMemo(() => Array.from(new Set(activeEmployees.map((e) => e.rank))), [activeEmployees])

  const [period, setPeriod] = useState('March 2025')
  const [runType, setRunType] = useState('Salary')
  const [includeMode, setIncludeMode] = useState('all') // all | specific
  const [selectedRanks, setSelectedRanks] = useState([])
  const [notes, setNotes] = useState('')

  const [previewEmployees, setPreviewEmployees] = useState([])
  const [amountByEmpId, setAmountByEmpId] = useState({})

  function setStep(nextStep) {
    if (nextStep === 1) {
      // Reset preview state when going back to details.
      setPreviewEmployees([])
      setAmountByEmpId({})
    }
    setRunStep(nextStep)
  }

  const previewTotal = useMemo(() => {
    return previewEmployees.reduce((sum, emp) => {
      const v = Number(amountByEmpId[emp.id]) || 0
      return sum + v
    }, 0)
  }, [previewEmployees, amountByEmpId])

  // Per your spec: show error when preview amount is less than wallet amount.
  const walletError = previewEmployees.length > 0 && previewTotal > walletBalance

  const ctaDisabled = walletError || previewEmployees.length === 0
  const ctaLabel = approvalOn ? 'Submit for approval →' : 'Make payment now →'

  const targetRanks = useMemo(() => {
    if (includeMode === 'all') return availableRanks
    return selectedRanks
  }, [includeMode, availableRanks, selectedRanks])

  function toggleRank(rank) {
    setSelectedRanks((prev) => {
      if (prev.includes(rank)) return prev.filter((r) => r !== rank)
      return [...prev, rank]
    })
  }

  function loadPreview() {
    const list = activeEmployees.filter((e) => targetRanks.includes(e.rank))
    const initialAmounts = {}
    list.forEach((e) => {
      initialAmounts[e.id] = e.netSalary
    })
    setPreviewEmployees(list)
    setAmountByEmpId(initialAmounts)
    setRunStep(2)
  }

  return (
    <>
      <div className="nps">
        {[1, 2, 3].map((n) => (
          <button key={n} type="button" className={`npt${runStep === n ? ' on' : ''}`} onClick={() => setStep(n)}>
            {n === 1 ? '1. Details' : n === 2 ? '2. Preview' : '3. Done'}
          </button>
        ))}
      </div>

      {runStep === 1 && (
        <>
          <div className="form-card">
            <div className="fc-title">Payment run details</div>

            <div className="fg fg-2">
              <div className="field">
                <label>Period</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option>March 2025</option>
                  <option>April 2025</option>
                </select>
              </div>

              <div className="field">
                <label>Type</label>
                <select value={runType} onChange={(e) => setRunType(e.target.value)}>
                  <option>Salary</option>
                  <option>Bonus</option>
                  <option>Allowance</option>
                </select>
              </div>
            </div>

            <div className="fg fg-2">
              <div className="field">
                <label>Include ranks</label>
                <select value={includeMode} onChange={(e) => setIncludeMode(e.target.value)}>
                  <option value="all">All active ranks</option>
                  <option value="specific">Specific ranks</option>
                </select>
              </div>

              <div className="field">
                <label>Notes (optional)</label>
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. end of term bonus" />
              </div>
            </div>

            {includeMode === 'specific' && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Choose ranks</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableRanks.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`pill${selectedRanks.includes(r) ? ' on' : ''}`}
                      onClick={() => toggleRank(r)}
                      aria-pressed={selectedRanks.includes(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="tb-btn primary"
            style={{ padding: '9px 18px' }}
            onClick={loadPreview}
            disabled={activeEmployees.length === 0 || (includeMode === 'specific' && selectedRanks.length === 0)}
          >
            Load employees →
          </button>
        </>
      )}

      {runStep === 2 && (
        <>
          <div className="total-bar">
            <span>Total disbursement</span>
            <span style={{ color: walletError ? 'var(--danger)' : 'var(--positive)' }}>{formatNaira(previewTotal)}</span>
          </div>

          {walletError && (
            <div className="info-box" style={{ marginBottom: 12, borderLeft: '3px solid var(--danger)' }}>
              Preview total {formatNaira(previewTotal)} is More than wallet balance {formatNaira(walletBalance)}.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {previewEmployees.map((emp) => {
              const value = Number(amountByEmpId[emp.id]) || 0
              return (
                <div key={emp.id} className="preview-block">
                  <div className="pr-head">
                    <span>
                      {emp.name}{' '}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                        ({emp.rank} · {emp.department})
                      </span>
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{formatNaira(emp.netSalary)} base</span>
                  </div>
                  <div className="pr-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Payment amount</span>
                    <span>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const next = Number(e.target.value)
                          setAmountByEmpId((prev) => ({ ...prev, [emp.id]: Number.isFinite(next) ? next : 0 }))
                        }}
                        style={{
                          width: 140,
                          padding: '7px 10px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: 'var(--surface-white)',
                          color: 'var(--text)',
                          outline: 'none',
                        }}
                      />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" className="tb-btn" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              type="button"
              className="tb-btn primary"
              onClick={() => {
                addToast(approvalOn ? 'Run submitted for approval' : 'Payments made', 'success')
                setStep(3)
              }}
              disabled={ctaDisabled}
              style={ctaDisabled ? { opacity: 0.65, cursor: 'not-allowed' } : undefined}
            >
              {ctaLabel}
            </button>
          </div>
        </>
      )}

      {runStep === 3 && (
        <div className="ap-card" style={{ textAlign: 'center', padding: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--accent)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M4 11l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {!approvalOn ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Payment completed</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>All payments were processed (demo).</p>
              <button
                type="button"
                className="tb-btn primary"
                onClick={() => {
                  setRunStep(1)
                  go('overview')
                }}
              >
                Go to dashboard →
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Run submitted</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Finance has been notified (demo — no backend).</p>
              <button
                type="button"
                className="tb-btn primary"
                onClick={() => {
                  setRunStep(1)
                  go('approvals')
                }}
              >
                View approval status →
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default PaymentHistory
