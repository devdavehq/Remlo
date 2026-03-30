import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  IconAddPerson,
  IconCheck,
  IconList,
  IconOverview,
  IconPeople,
  IconPlusRun,
  IconReport,
  IconSettings,
  IconTeam,
  IconUser,
  IconWallet,
} from '../icons/icons'

import  {
  Overview,
  AddEmp,
  Employees, 
  Empdetail,
  Approvals,
  PaymentHistory,
  NewPaymentRun,
  Reports,
  Settings,
  Team,
  Wallet,
} from './components/Exports'

import RemloBrand from '../components/RemloBrand'
import { useToast } from '../toast/useToast'

const TITLES = {
  overview: 'Overview',
  'new-run': 'New payment run',
  payments: 'Payment history',
  employees: 'Employees',
  'add-emp': 'Add employee',
  wallet: 'Wallet',
  reports: 'Reports',
  approvals: 'Approvals',
  'emp-detail': 'Employee detail',
  team: 'Team & roles',
  settings: 'Settings',
}

const NAV = [
  { section: 'overview', label: 'Overview', Icon: IconOverview },
  { section: 'new-run', label: 'New payment run', Icon: IconPlusRun },
  { section: 'payments', label: 'Payment history', Icon: IconList },
  { section: 'employees', label: 'Employees', Icon: IconPeople },
  { section: 'add-emp', label: 'Add employee', Icon: IconAddPerson },
  { section: 'wallet', label: 'Wallet', Icon: IconWallet },
  { section: 'reports', label: 'Reports', Icon: IconReport },
  { section: 'approvals', label: 'Approvals', Icon: IconCheck, badge: '2' },
  { section: 'emp-detail', label: 'Employee detail', Icon: IconUser },
  { section: 'team', label: 'Team & roles', Icon: IconTeam },
  { section: 'settings', label: 'Settings', Icon: IconSettings },
]

const DEFAULT_RANKS = ['Junior Teacher', 'Senior Teacher', 'Head of Department', 'Vice Principal', 'Principal']

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const urlSection = new URLSearchParams(location.search).get('section') || 'overview'
  const [section, setSection] = useState(urlSection)
  const [runStep, setRunStep] = useState(1)
  const [pill, setPill] = useState('all')
  const [approvalOn, setApprovalOn] = useState(false)
  const [employees, setEmployees] = useState([
    {
      id: 'emp-1',
      code: 'EMP-010',
      name: 'Amaka Osei',
      rank: 'HOD',
      department: 'Sciences',
      netSalary: 296000,
      active: true,
    },
    {
      id: 'emp-2',
      code: 'EMP-011',
      name: 'Bisi Adeyemi',
      rank: 'Senior Teacher',
      department: 'English',
      netSalary: 212000,
      active: true,
    },
    {
      id: 'emp-3',
      code: 'EMP-012',
      name: 'Chuks Nwosu',
      rank: 'Junior Teacher',
      department: 'Maths',
      netSalary: 128400,
      active: true,
    },
  ])
  const [employeeQuery, setEmployeeQuery] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('emp-1')

  const [addEmpForm, setAddEmpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rank: 'Junior Teacher',
    department: '',
    dateHired: '',
    grossSalary: '',
    employeeCode: '',
    bank: 'GTBank',
    accountNumber: '',
    verifiedName: '',
    active: true,
  })

  const [bulkPreview, setBulkPreview] = useState([])
  const [bulkError, setBulkError] = useState('')
  const [bulkFileName, setBulkFileName] = useState('')

  const parseBool = (value) => {
    if (value === null || value === undefined) return false
    const v = String(value).trim().toLowerCase()
    if (!v) return false
    return v === '1' || v === 'true' || v === 'yes' || v === 'active'
  }

  function parseCsvLine(line) {
    const out = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        const next = line[i + 1]
        if (inQuotes && next === '"') {
          // Escaped quote: ""
          cur += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
        continue
      }
      if (ch === ',' && !inQuotes) {
        out.push(cur)
        cur = ''
        continue
      }
      cur += ch
    }
    out.push(cur)
    return out.map((s) => s.trim())
  }

  function parseCsvText(text) {
    const lines = String(text)
      .replace(/\r/g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length < 2) return []

    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i])
      if (cols.every((c) => !c)) continue

      const obj = {}
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] ?? ''
      })
      rows.push(obj)
    }

    return rows
  }

  function normalizeEmployeeFromRow(row, index) {
    const get = (keys) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim()
      }
      return ''
    }

    const firstName = get(['firstname', 'first_name'])
    const lastName = get(['lastname', 'last_name'])
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || get(['name', 'fullname', 'full_name'])

    const rank = get(['rank', 'title', 'role', 'tier'])
    const department = get(['department', 'dept'])
    const grossSalaryRaw = get(['grosssalary', 'gross_salary', 'gros_salary', 'gross', 'salary', 'netsalary', 'net_salary', 'net_salary'])
    const netSalary = grossSalaryRaw ? Number(grossSalaryRaw) : 0

    const employeeCode = get(['employeecode', 'employee_code', 'code', 'empcode', 'emp_code'])
    const bank = get(['bank'])
    const accountNumber = get(['accountnumber', 'account_number', 'acct', 'acct_number'])
    const email = get(['email', 'workemail', 'work_email'])
    const phone = get(['phone', 'tel', 'telephone'])
    const dateHired = get(['datehired', 'date_hired'])

    const activeRaw = get(['active', 'isactive', 'is_active'])
    const active = activeRaw === '' ? true : parseBool(activeRaw)

    if (!fullName || !rank || !department) return null

    const code = employeeCode || `EMP-${String(index + 1).padStart(3, '0')}-${index}`

    return {
      id: `emp-bulk-${index}`,
      code,
      name: fullName,
      rank,
      department,
      netSalary: Number.isFinite(netSalary) ? netSalary : 0,
      active,
      email,
      phone,
      dateHired,
      bank: bank || 'GTBank',
      accountNumber,
      verifiedName: 'Auto-verified',
      grossSalary: Number.isFinite(netSalary) ? netSalary : 0,
    }
  }
  const [ranks, setRanks] = useState(DEFAULT_RANKS)
  const [newRank, setNewRank] = useState('')
  const [teamRows, setTeamRows] = useState([
    { initials: 'NA', name: 'Ngozi Adeyemi', email: 'ngozi@brightfuture.edu.ng', role: 'Admin', tag: 'You', pending: false, active: true },
    { initials: 'CO', name: 'Chidi Obi', email: 'chidi@brightfuture.edu.ng', role: 'Finance', tag: 'Edit', pending: false, active: true },
  ])
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Finance')
  const [teamEditEmail, setTeamEditEmail] = useState(null)
  const { addToast } = useToast()

  const title = TITLES[section] || 'Dashboard'

  useEffect(() => {
    setSection(urlSection)
  }, [urlSection])

  useEffect(() => {
    if (urlSection === 'new-run') setRunStep(1)
  }, [urlSection])

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0]
  }, [employees, selectedEmployeeId])

  const filteredEmployees = useMemo(() => {
    const q = employeeQuery.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)

      const rankLower = e.rank.toLowerCase()
      const matchesPill =
        pill === 'all'
          ? true
          : pill === 'junior'
            ? rankLower.includes('junior')
            : pill === 'senior'
              ? rankLower.includes('senior')
              : true

      return matchesQuery && matchesPill
    })
  }, [employees, employeeQuery, pill])

  function formatNaira(value) {
    const n = Number(value) || 0
    return `₦${n.toLocaleString('en-NG')}`
  }

  const rankRows = useMemo(
    () =>
      ranks.map((name, i) => (
        <div key={name + i} className="rank-row">
          <span className="drag">⠿</span>
          <span>{name}</span>
          <span className="lv">Level {i + 1}</span>
          <span
            className="del"
            role="button"
            tabIndex={0}
            onClick={() => setRanks((r) => r.filter((_, j) => j !== i))}
            onKeyDown={(e) => e.key === 'Enter' && setRanks((r) => r.filter((_, j) => j !== i))}
          >
            ×
          </span>
        </div>
      )),
    [ranks]
  )

  function addRank() {
    const v = newRank.trim()
    if (!v) return
    setRanks((r) => [...r, v])
    setNewRank('')
    addToast('Rank added', 'success')
  }

  function sendInvite(e) {
    e.preventDefault()
    const wasEditing = Boolean(teamEditEmail)
    const name = inviteName.trim()
    const email = inviteEmail.trim()
    if (!name || !email.includes('@')) return
    const initials = name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    if (teamEditEmail) {
      // Update an existing team member (Edit mode).
      setTeamRows((rows) =>
        rows.map((r) => {
          if (r.email !== teamEditEmail) return r
          return {
            ...r,
            initials,
            name,
            email,
            role: inviteRole,
            tag: 'Updated',
            pending: false,
            active: true,
          }
        })
      )
      setTeamEditEmail(null)
    } else {
      // Create a new team member (Invite mode).
      setTeamRows((rows) => [
        ...rows,
        { initials, name, email, role: inviteRole, tag: 'Resend', pending: true, active: true },
      ])
    }

    setInviteName('')
    setInviteEmail('')

    addToast(wasEditing ? 'Team member updated' : 'Invite sent', 'success')
  }

  function startTeamEdit(row) {
    setTeamEditEmail(row.email)
    setInviteName(row.name)
    setInviteEmail(row.email)
    setInviteRole(row.role)
  }

  function toggleTeamActive(email) {
    const existing = teamRows.find((r) => r.email === email)
    const nextActive = existing ? !existing.active : true
    setTeamRows((rows) =>
      rows.map((r) => {
        if (r.email !== email) return r
        return {
          ...r,
          pending: false,
          active: nextActive,
          tag: nextActive ? 'Reactivated' : 'Deactivated',
        }
      })
    )

    // If you deactivate while editing, exit edit mode to avoid confusion.
    if (teamEditEmail === email) setTeamEditEmail(null)

    addToast(nextActive ? 'Team member reactivated' : 'Team member deactivated', nextActive ? 'success' : 'error')
  }

  function handleBulkFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    setBulkError('')
    setBulkPreview([])
    setBulkFileName(file.name)

    const lower = file.name.toLowerCase()
    const isCsv = lower.endsWith('.csv') || file.type.toLowerCase().includes('csv')

    if (!isCsv) {
      setBulkError('Excel import is not enabled yet. For now, please use CSV files.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result || '')
        const parsed = parseCsvText(text)
        const normalized = parsed
          .map((row, idx) => normalizeEmployeeFromRow(row, idx))
          .filter(Boolean)

        if (normalized.length === 0) {
          setBulkError('No valid employees found. Check your CSV headers and required columns.')
        } else {
          setBulkError('')
        }
        setBulkPreview(normalized)
      } catch {
        setBulkError('Failed to parse CSV. Make sure it is comma-separated with headers.')
      }
    }
    reader.onerror = () => {
      setBulkError('Failed to read file.')
    }

    reader.readAsText(file)
  }

  function importBulkEmployees() {
    if (bulkPreview.length === 0) return

    setEmployees((prev) => {
      const byCode = new Map(prev.map((x) => [x.code, x]))
      for (const emp of bulkPreview) {
        const existing = byCode.get(emp.code)
        if (existing) {
          byCode.set(emp.code, { ...existing, ...emp, id: existing.id })
        } else {
          byCode.set(emp.code, emp)
        }
      }
      return Array.from(byCode.values())
    })

    const first = bulkPreview[0]
    if (first) setSelectedEmployeeId(first.id)

    addToast(`Imported ${bulkPreview.length} employees`, 'success')
    setBulkPreview([])
    setBulkFileName('')
    setBulkError('')
    go('employees')
  }

  function saveSingleEmployee() {
    const firstName = addEmpForm.firstName.trim()
    const lastName = addEmpForm.lastName.trim()
    const department = addEmpForm.department.trim()
    const rank = addEmpForm.rank
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

    const grossSalary = Number(addEmpForm.grossSalary)
    const netSalary = Number.isFinite(grossSalary) ? grossSalary : 0

    if (!fullName || !rank || !department) {
      addToast('Please fill First name, Last name, Rank, and Department.', 'error')
      return
    }

    const nextIndex = employees.length + 1
    const code = addEmpForm.employeeCode.trim() || `EMP-${String(nextIndex).padStart(3, '0')}`

    const newEmp = {
      id: `emp-${nextIndex}`,
      code,
      name: fullName,
      rank,
      department,
      netSalary,
      active: addEmpForm.active,
      email: addEmpForm.email.trim(),
      phone: addEmpForm.phone.trim(),
      dateHired: addEmpForm.dateHired,
      bank: addEmpForm.bank,
      accountNumber: addEmpForm.accountNumber,
      verifiedName: addEmpForm.verifiedName || 'Auto-verified',
      grossSalary: netSalary,
    }

    setEmployees((prev) => {
      const byCode = new Map(prev.map((x) => [x.code, x]))
      const existing = byCode.get(newEmp.code)
      if (existing) byCode.set(newEmp.code, { ...existing, ...newEmp, id: existing.id })
      else byCode.set(newEmp.code, newEmp)
      return Array.from(byCode.values())
    })

    setSelectedEmployeeId(newEmp.id)
    addToast('Employee saved', 'success')

    setAddEmpForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      rank: 'Junior Teacher',
      department: '',
      dateHired: '',
      grossSalary: '',
      employeeCode: '',
      bank: 'GTBank',
      accountNumber: '',
      verifiedName: '',
      active: true,
    })

    go('employees')
  }

  function go(nav) {
    const params = new URLSearchParams(location.search)
    params.set('section', nav)
    navigate(`/dashboard?${params.toString()}`)
    setSection(nav)
    if (nav === 'new-run') setRunStep(1)
  }

  return (
    <div className="dashboard-root">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <RemloBrand size={120} onClickCycle initialVariant={0} />
          </div>
          <div className="nav-scroll">
            <div className="nav-section">Main</div>
            {NAV.slice(0, 7).map((item) => {
              const { section: id, label, badge } = item
              const NavIcon = item.Icon
              return (
              <button
                key={id}
                type="button"
                className={`nav-item${section === id ? ' on' : ''}`}
                onClick={() => go(id)}
              >
                <NavIcon />
                {label}
                {badge ? <span className="badge">{badge}</span> : null}
              </button>
            )})}
            <div className="nav-section">Admin</div>
            {NAV.slice(7).map((item) => {
              const { section: id, label, badge } = item
              const NavIcon = item.Icon
              return (
              <button
                key={id}
                type="button"
                className={`nav-item${section === id ? ' on' : ''}`}
                onClick={() => go(id)}
              >
                <NavIcon />
                {label}
                {badge ? <span className="badge">{badge}</span> : null}
              </button>
            )})}
          </div>
          <div className="co-foot">
            <strong>Bright Future Academy</strong>
            Admin · Ngozi A. · <Link to="/login">Sign out</Link>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="tb-title">{title}</div>
            <div className="tb-actions">
              <button type="button" className="tb-btn">
                Mar 2025
              </button>
              <button type="button" className="tb-btn primary" onClick={() => go('new-run')}>
                + New payment run
              </button>
            </div>
          </header>

          <div className="content">
            {section === 'overview' && (
                <Overview go={go}/>
            )}

            {section === 'payments' && <PaymentHistory />}

            {section === 'new-run' && (
              <NewPaymentRun
                runStep={runStep}
                setRunStep={setRunStep}
                go={go}
                employees={employees}
                walletBalance={4200000}
                approvalOn={approvalOn}
              />
            )}

            {section === 'employees' && (
              <>
                <div className="search-bar">
                  <input value={employeeQuery} onChange={(e) => setEmployeeQuery(e.target.value)} placeholder="Search by name or code…" />
                  {['all', 'junior', 'senior'].map((p) => (
                    <button key={p} type="button" className={`pill${pill === p ? ' on' : ''}`} onClick={() => setPill(p)}>
                      {p[0].toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                  <button type="button" className="tb-btn primary" style={{ fontSize: 11, padding: '5px 10px' }} onClick={() => go('add-emp')}>
                    + Add
                  </button>
                </div>
                <div className="tbl emp-cols">
                  <div className="th emp-cols">
                    <span>Employee</span>
                    <span>Rank</span>
                    <span>Department</span>
                    <span>Net salary</span>
                    <span>Status</span>
                  </div>
                  {filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className="tr emp-cols"
                      onClick={() => {
                        setSelectedEmployeeId(emp.id)
                        go('emp-detail')
                      }}
                    >
                      <span>{emp.name}</span>
                      <span>
                        <span className="rtag">{emp.rank}</span>
                      </span>
                      <span>{emp.department}</span>
                      <span>{formatNaira(emp.netSalary)}</span>
                      <span>
                        <span className={`sb${emp.active ? ' sb-ok' : ' sb-rej'}`}>{emp.active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {section === 'add-emp' && (
              <>
                <div className="form-card">
                  <div className="fc-title">Bulk upload (CSV)</div>
                  <div className="fg fg-2">
                    <div className="field">
                      <label>Upload file</label>
                      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleBulkFileChange} />
                    </div>
                    <div className="field">
                      <label>Tip: required headers</label>
                      <input
                        readOnly
                        value="firstName,lastName,rank,department,grossSalary,employeeCode,active"
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>

                  {bulkFileName ? (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                      File: <strong style={{ color: 'var(--text)' }}>{bulkFileName}</strong>
                    </div>
                  ) : null}

                  {bulkError ? (
                    <div className="info-box" style={{ marginTop: 10, borderLeft: '3px solid var(--danger)' }}>
                      {bulkError}
                    </div>
                  ) : null}

                  {bulkPreview.length > 0 ? (
                    <>
                      <div className="sec-title" style={{ marginTop: 14 }}>
                        Preview ({bulkPreview.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {bulkPreview.slice(0, 6).map((emp) => (
                          <div key={emp.id} className="inv-row" style={{ marginBottom: 0 }}>
                            <div className="inv-av">{emp.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
                            <div className="inv-name">
                              <strong>{emp.name}</strong>
                              <span>
                                {emp.rank} · {emp.department}
                              </span>
                            </div>
                            <span className={`sb ${emp.active ? 'sb-ok' : 'sb-rej'}`}>{emp.active ? 'Active' : 'Inactive'}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  <button
                    type="button"
                    className="tb-btn primary"
                    style={{ marginTop: 14, opacity: bulkPreview.length === 0 ? 0.65 : 1, cursor: bulkPreview.length === 0 ? 'not-allowed' : 'pointer' }}
                    onClick={importBulkEmployees}
                    disabled={bulkPreview.length === 0}
                  >
                    Import to employees →
                  </button>
                </div>

                <div className="form-card">
                  <div className="fc-title">Personal information</div>
                  <div className="fg fg-2">
                    <div className="field">
                      <label>First name</label>
                      <input value={addEmpForm.firstName} onChange={(e) => setAddEmpForm((s) => ({ ...s, firstName: e.target.value }))} placeholder="Funke" />
                    </div>
                    <div className="field">
                      <label>Last name</label>
                      <input value={addEmpForm.lastName} onChange={(e) => setAddEmpForm((s) => ({ ...s, lastName: e.target.value }))} placeholder="Adeleke" />
                    </div>
                  </div>
                  <div className="fg fg-2">
                    <div className="field">
                      <label>Email (optional)</label>
                      <input value={addEmpForm.email} onChange={(e) => setAddEmpForm((s) => ({ ...s, email: e.target.value }))} type="email" placeholder="funke@school.edu.ng" />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input value={addEmpForm.phone} onChange={(e) => setAddEmpForm((s) => ({ ...s, phone: e.target.value }))} placeholder="+234 …" />
                    </div>
                  </div>
                  <div className="fg fg-3">
                    <div className="field">
                      <label>Rank</label>
                      <select value={addEmpForm.rank} onChange={(e) => setAddEmpForm((s) => ({ ...s, rank: e.target.value }))}>
                        <option>Junior Teacher</option>
                        <option>Senior Teacher</option>
                        <option>HOD</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Department</label>
                      <input value={addEmpForm.department} onChange={(e) => setAddEmpForm((s) => ({ ...s, department: e.target.value }))} placeholder="Sciences" />
                    </div>
                    <div className="field">
                      <label>Date hired</label>
                      <input type="date" value={addEmpForm.dateHired} onChange={(e) => setAddEmpForm((s) => ({ ...s, dateHired: e.target.value }))} />
                    </div>
                  </div>

                  <div className="tog-row" style={{ marginTop: 10 }}>
                    <div className="tog-info">
                      <strong>Active</strong>
                      <span>Inactive employees won’t appear in payment runs.</span>
                    </div>
                    <label className="tog">
                      <input type="checkbox" checked={addEmpForm.active} onChange={(e) => setAddEmpForm((s) => ({ ...s, active: e.target.checked }))} />
                      <span className="tog-tr" />
                      <span className="tog-th" />
                    </label>
                  </div>
                </div>

                <div className="form-card">
                  <div className="fc-title">Bank & salary</div>
                  <div className="fg fg-2">
                    <div className="field">
                      <label>Gross salary (₦)</label>
                      <input type="number" value={addEmpForm.grossSalary} onChange={(e) => setAddEmpForm((s) => ({ ...s, grossSalary: e.target.value }))} placeholder="250000" />
                    </div>
                    <div className="field">
                      <label>Employee code</label>
                      <input value={addEmpForm.employeeCode} onChange={(e) => setAddEmpForm((s) => ({ ...s, employeeCode: e.target.value }))} placeholder="Auto (EMP-064)" />
                    </div>
                  </div>
                  <div className="fg fg-3">
                    <div className="field">
                      <label>Bank</label>
                      <select value={addEmpForm.bank} onChange={(e) => setAddEmpForm((s) => ({ ...s, bank: e.target.value }))}>
                        <option>GTBank</option>
                        <option>Zenith</option>
                        <option>UBA</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Account number</label>
                      <input value={addEmpForm.accountNumber} onChange={(e) => setAddEmpForm((s) => ({ ...s, accountNumber: e.target.value }))} placeholder="10 digits" maxLength={10} />
                    </div>
                    <div className="field">
                      <label>Verified name</label>
                      <input
                        readOnly
                        value={addEmpForm.verifiedName || 'Auto-verified'}
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                    NUBAN + Paystack name check would run when a backend exists.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="tb-btn" onClick={() => go('employees')}>
                    Cancel
                  </button>
                  <button type="button" className="tb-btn primary" onClick={saveSingleEmployee}>
                    Save employee
                  </button>
                </div>
              </>
            )}

            {section === 'wallet' && (
              <>
                <div className="wallet-hero">
                  <div className="wh-label">Available balance</div>
                  <div className="wh-amt">₦4,200,000</div>
                  <div className="wh-sub">Last funded Mar 20 · ₦5,000,000</div>
                  <div className="wh-actions">
                    <button type="button">+ Fund wallet</button>
                    <button type="button">Set alert</button>
                  </div>
                </div>
                <div className="sec-title">Transactions</div>
                <div className="tbl">
                  <div className="tr" style={{ display: 'flex', justifyContent: 'space-between', cursor: 'default' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>March salary run</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mar 27</div>
                    </div>
                    <div style={{ color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}>−₦12,400,000</div>
                  </div>
                  <div className="tr" style={{ display: 'flex', justifyContent: 'space-between', cursor: 'default' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>Wallet funded</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mar 20</div>
                    </div>
                    <div style={{ color: 'var(--positive)', fontSize: 12, fontWeight: 600 }}>+₦5,000,000</div>
                  </div>
                </div>
              </>
            )}

            {section === 'reports' && (
              <div className="reports-grid">
                {[
                  { t: 'PAYE report', d: 'Monthly tax per employee — FIRS.', c: 0 },
                  { t: 'Pension schedule', d: 'Employee + employer per PFA.', c: 1 },
                  { t: 'Payslips', d: 'PDF pack for all staff.', c: 2 },
                  { t: 'Audit log', d: 'CSV export of actions.', c: 3 },
                  { t: 'Payroll summary', d: 'Month-by-month totals.', c: 4 },
                  { t: 'NHF report', d: 'Housing fund list.', c: 5 },
                ].map((x) => (
                  <div key={x.t} className="report-card" style={{ borderLeft: '3px solid var(--accent-muted)' }}>
                    <div className="swatch" style={{ opacity: 0.85 }} />
                    <h4>{x.t}</h4>
                    <p>{x.d}</p>
                    <div className="dl">↓ Download (demo)</div>
                  </div>
                ))}
              </div>
            )}

            {section === 'approvals' && (
              <>
                <div className="ap-card">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>March 2025 — Bonus run · #012</div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
                    Uploaded by Ngozi · Today · 18 employees · ₦1,800,000
                  </p>
                  <div className="bdr">
                    <span>Senior teachers (10 × ₦60,000)</span>
                    <span>₦600,000</span>
                  </div>
                  <div className="bdr">
                    <span>HODs (8 × ₦150,000)</span>
                    <span>₦1,200,000</span>
                  </div>
                  <div className="bdr">
                    <span>Total</span>
                    <span>₦1,800,000</span>
                  </div>
                </div>
                <div className="sec-title">Approval chain</div>
                <div className="tl">
                  <div className="tls">
                    <div className="tld d">✓</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>Ngozi Adeyemi — submitted</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Today 9:10am</div>
                    </div>
                  </div>
                  <div className="tls">
                    <div className="tld p">!</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>Chidi Obi — Finance (you)</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Your approval is needed</div>
                      <div className="tl-actions">
                        <button type="button" className="btn-sm-ghost" onClick={() => addToast('Approval rejected (demo)', 'error')}>
                          Reject
                        </button>
                        <button type="button" className="btn-sm-primary" onClick={() => addToast('Run approved (demo)', 'success')}>
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="tls">
                    <div className="tld w">—</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>No Level 2 approver set</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Optional — add in Settings</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {section === 'emp-detail' && (
              <>
                <div className="emp-header">
                  <div className="avatar">
                    {selectedEmployee.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedEmployee.name}</div>
                    <div className="emp-meta">
                      {selectedEmployee.code} · {selectedEmployee.rank} · {selectedEmployee.department}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 7 }}>
                    <button type="button" className="tb-btn">
                      Edit
                    </button>
                    <button
                      type="button"
                      className="tb-btn"
                      style={{ color: selectedEmployee.active ? 'var(--danger)' : 'var(--positive)', borderColor: 'var(--border)' }}
                      onClick={() => {
                        const nextActive = !selectedEmployee.active
                        setEmployees((prev) =>
                          prev.map((e) => (e.id === selectedEmployee.id ? { ...e, active: !e.active } : e))
                        )
                        addToast(nextActive ? 'Employee activated' : 'Employee deactivated', nextActive ? 'success' : 'error')
                      }}
                    >
                      {selectedEmployee.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                <div className="ed-grid">
                  <div className="ed-card">
                    <div className="ed-title">Personal</div>
                    <div className="ed-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                      <span>{selectedEmployee.name.replace(/\s+/g, '.').toLowerCase()}@school.edu.ng</span>
                    </div>
                    <div className="ed-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                      <span style={{ color: selectedEmployee.active ? 'var(--positive)' : 'var(--danger)', fontWeight: 600 }}>
                        {selectedEmployee.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="ed-card">
                    <div className="ed-title">Compensation</div>
                    <div className="ed-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Gross</span>
                      <span>{formatNaira(selectedEmployee.netSalary)}</span>
                    </div>
                    <div className="ed-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Net pay</span>
                      <span style={{ color: 'var(--positive)', fontWeight: 600 }}>{formatNaira(selectedEmployee.netSalary)}</span>
                    </div>
                  </div>
                </div>
                <div className="sec-title" style={{ marginTop: 14 }}>
                  Payment history
                </div>
                <div className="tbl">
                  <div className="ph-row" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>
                    <span>Period</span>
                    <span>Gross</span>
                    <span>Net paid</span>
                    <span>Status</span>
                  </div>
                  <div className="ph-row">
                    <span>March 2025</span>
                    <span>₦300,000</span>
                    <span>₦253,500</span>
                    <span className="sb sb-ok">Sent</span>
                  </div>
                  <div className="ph-row">
                    <span>February 2025</span>
                    <span>₦300,000</span>
                    <span>₦253,500</span>
                    <span className="sb sb-ok">Sent</span>
                  </div>
                </div>
              </>
            )}

            {section === 'team' && (
              <>
                <div className="sec-title">Team members</div>
                {teamRows.map((row) => (
                  <div key={row.email + row.name} className="inv-row">
                    <div className="inv-av">{row.initials}</div>
                    <div className="inv-name">
                      <strong>{row.name}</strong>
                      <span>{row.email}</span>
                    </div>
                    <span className={`rb${row.role === 'Admin' ? ' rb-a' : ''}`}>{row.role}</span>
                    <span style={{ fontSize: 11, color: row.pending ? 'var(--text-muted)' : 'var(--accent)', cursor: 'pointer' }}>{row.tag}</span>
                    <div style={{ display: 'flex', gap: 7, marginLeft: 6 }}>
                      <button
                        type="button"
                        className="btn-sm-ghost"
                        onClick={() => startTeamEdit(row)}
                        aria-label={`Edit ${row.name}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-sm-primary"
                        style={{
                          background: row.active ? 'var(--surface)' : 'var(--accent)',
                          border: row.active ? '1px solid var(--border)' : 'none',
                          color: row.active ? 'var(--text-secondary)' : '#ffffff',
                        }}
                        onClick={() => toggleTeamActive(row.email)}
                        aria-label={`${row.active ? 'Deactivate' : 'Activate'} ${row.name}`}
                      >
                        {row.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="form-card" style={{ marginTop: 12 }}>
                  <div className="fc-title">{teamEditEmail ? 'Edit team member' : 'Invite a team member (Remlo-style)'}</div>
                  <form onSubmit={sendInvite}>
                    <div className="fg fg-2">
                      <div className="field">
                        <label htmlFor="in">Full name</label>
                        <input id="in" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Kemi Afolabi" />
                      </div>
                      <div className="field">
                        <label htmlFor="ie">Work email</label>
                        <input
                          id="ie"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="kemi@school.edu.ng"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="ir">Role</label>
                      <select id="ir" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                        <option value="Finance">Finance — approve runs</option>
                        <option value="HR">HR — manage staff</option>
                        <option value="Viewer">Viewer — read only</option>
                      </select>
                    </div>
                    {teamEditEmail ? (
                      <p className="info-box" style={{ marginTop: 0 }}>
                        Updating member details (demo UI).
                      </p>
                    ) : (
                      <p className="info-box" style={{ marginTop: 0 }}>
                        They get an email link (48h) — demo UI only, no mail sent.
                      </p>
                    )}

                    {teamEditEmail && (
                      <div className="btn-row" style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => {
                            setTeamEditEmail(null)
                            setInviteName('')
                            setInviteEmail('')
                            setInviteRole('Finance')
                          }}
                        >
                          Cancel edit
                        </button>
                        <button type="submit" className="tb-btn primary">
                          Save changes →
                        </button>
                      </div>
                    )}

                    {!teamEditEmail && (
                    <button type="submit" className="tb-btn primary">
                      Send invite →
                    </button>
                    )}
                  </form>
                </div>
              </>
            )}

            {section === 'settings' && (
              <div className="set-grid">
                <div className="set-card">
                  <div className="set-title">Approval workflow</div>
                  <div className="tog-row">
                    <div className="tog-info">
                      <strong>Require approval before payment</strong>
                      <span>Off by default — turn on for multi-step sign-off</span>
                    </div>
                    <label className="tog">
                      <input type="checkbox" checked={approvalOn} onChange={(e) => setApprovalOn(e.target.checked)} />
                      <span className="tog-tr" />
                      <span className="tog-th" />
                    </label>
                  </div>
                  {approvalOn && (
                    <div style={{ marginTop: 12 }}>
                      <div className="ap-lev">
                        <span className="lev-badge">L1</span>
                        <select>
                          <option>Chidi Obi (Finance)</option>
                          <option>Ngozi (you)</option>
                        </select>
                        <input placeholder="Any amount" />
                      </div>
                      <div className="ap-lev">
                        <span className="lev-badge">L2</span>
                        <select>
                          <option>Select…</option>
                          <option>Emeka Eze</option>
                        </select>
                        <input placeholder="Min ₦" />
                      </div>
                      <p className="info-box">Level 2 optional — PayStaff-style thresholds.</p>
                    </div>
                  )}
                </div>
                <div className="set-card">
                  <div className="set-title">Deductions</div>
                  {['PAYE (income tax)', 'Pension (PFA)', 'NHF'].map((label, i) => (
                    <div key={label} className="tog-row">
                      <div className="tog-info">
                        <strong>{label}</strong>
                        <span>{i === 0 ? 'Auto per tax bands' : i === 1 ? '8% + 10%' : '2.5% basic'}</span>
                      </div>
                      <label className="tog">
                        <input type="checkbox" defaultChecked={i < 2} />
                        <span className="tog-tr" />
                        <span className="tog-th" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="set-card">
                  <div className="set-title">Rank management</div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>From PayStaff onboarding — edit anytime.</p>
                  <div className="rank-list-ui">{rankRows}</div>
                  <div className="add-rank">
                    <input value={newRank} onChange={(e) => setNewRank(e.target.value)} placeholder="Add custom rank…" />
                    <button type="button" onClick={addRank}>
                      + Add
                    </button>
                  </div>
                </div>
                <div className="set-card">
                  <div className="set-title">Notifications</div>
                  {['Run submitted', 'Payment sent (SMS)', 'Low wallet', 'Failed payment'].map((label) => (
                    <div key={label} className="tog-row">
                      <div className="tog-info">
                        <strong>{label}</strong>
                        <span>Email or SMS (demo toggles)</span>
                      </div>
                      <label className="tog">
                        <input type="checkbox" defaultChecked />
                        <span className="tog-tr" />
                        <span className="tog-th" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
