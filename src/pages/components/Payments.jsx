import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";

function formatNaira(value) {
  const n = Number(value) || 0;
  return `₦${n.toLocaleString("en-NG")}`;
}

// Custom Select component
function CustomSelect({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;
  return (
    <div className='csel-wrap' style={{ position: "relative" }}>
      <button
        type='button'
        className='csel-trigger'
        onClick={() => setOpen((p) => !p)}>
        {selected?.icon && <span className='csel-icon'>{selected.icon}</span>}
        <span className={selected ? "" : "csel-placeholder"}>{label}</span>
        <svg
          className='csel-chevron'
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'>
          <path
            d='M3 4.5L6 7.5L9 4.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {open && (
        <>
          <div className='csel-backdrop' onClick={() => setOpen(false)} />
          <div className='csel-dropdown' role='listbox'>
            {options.map((opt) => {
              const val = opt.value ?? opt;
              const lbl = opt.label ?? opt;
              const isSelected = val === value;
              return (
                <button
                  key={val}
                  type='button'
                  className={`csel-option${isSelected ? " selected" : ""}`}
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}>
                  {opt.icon && (
                    <span className='csel-option-icon'>{opt.icon}</span>
                  )}
                  <span className='csel-option-label'>{lbl}</span>
                  {opt.description && (
                    <span className='csel-option-desc'>{opt.description}</span>
                  )}
                  {isSelected && (
                    <svg
                      className='csel-check'
                      width='12'
                      height='12'
                      viewBox='0 0 12 12'
                      fill='none'>
                      <path
                        d='M2.5 6L5 8.5L9.5 3.5'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const PAGE_SIZE_PH = 5;

function PaymentDetailModal({ run, onClose }) {
  if (!run) return null;
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-content wide-modal'
        onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <div>
            <h3 style={{ margin: 0 }}>{run.title}</h3>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 2,
              }}>
              {run.date}
            </div>
          </div>
          <button className='modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='ph-detail-grid'>
            <div className='ph-detail-card'>
              <div className='ph-detail-label'>Status</div>
              <span
                className={`sb ${run.status === "Completed" ? "sb-ok" : run.status === "Pending approval" ? "sb-pend" : "sb-rej"}`}>
                {run.status}
              </span>
            </div>
            <div className='ph-detail-card'>
              <div className='ph-detail-label'>Submitted by</div>
              <div className='ph-detail-value'>
                {run.submittedBy || "Ngozi Adeyemi"}
              </div>
            </div>
            <div className='ph-detail-card'>
              <div className='ph-detail-label'>Employees</div>
              <div className='ph-detail-value'>{run.employeeCount}</div>
            </div>
            <div className='ph-detail-card'>
              <div className='ph-detail-label'>Total amount</div>
              <div
                className='ph-detail-value'
                style={{ color: "var(--positive)", fontWeight: 600 }}>
                {run.amount}
              </div>
            </div>
          </div>

          {run.breakdown && (
            <>
              <div
                className='sec-title'
                style={{ marginTop: 16, marginBottom: 8 }}>
                Breakdown
              </div>
              <div className='tbl'>
                {run.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className='tr'
                    style={{
                      gridTemplateColumns: "1fr auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {item.label}
                    </span>
                    <span style={{ fontWeight: 500 }}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function PaymentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: [],
  });

  const paymentRuns = [
    {
      id: 1,
      title: "March 2025 — Salary run",
      status: "Completed",
      employeeCount: 63,
      amount: "₦12,400,000",
      date: "Mar 27 · direct",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2025-03-27",
      breakdown: [
        { label: "Junior Teachers (35 × ₦128,400)", amount: "₦4,494,000" },
        { label: "Senior Teachers (18 × ₦212,000)", amount: "₦3,816,000" },
        { label: "HODs (10 × ₦296,000)", amount: "₦2,960,000" },
        { label: "Other (10)", amount: "₦1,130,000" },
      ],
    },
    {
      id: 2,
      title: "March 2025 — Bonus run",
      status: "Pending approval",
      employeeCount: 18,
      amount: "₦1,800,000",
      date: "Today 9:10am",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2025-03-27",
      breakdown: [
        { label: "Senior teachers (10 × ₦60,000)", amount: "₦600,000" },
        { label: "HODs (8 × ₦150,000)", amount: "₦1,200,000" },
      ],
    },
    {
      id: 3,
      title: "February 2025 — Salary run",
      status: "Completed",
      employeeCount: 61,
      amount: "₦11,900,000",
      date: "Feb 26",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2025-02-26",
    },
    {
      id: 4,
      title: "January 2025 — Salary run",
      status: "Completed",
      employeeCount: 60,
      amount: "₦11,500,000",
      date: "Jan 28",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2025-01-28",
    },
    {
      id: 5,
      title: "December 2024 — Salary run",
      status: "Completed",
      employeeCount: 58,
      amount: "₦11,200,000",
      date: "Dec 27",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2024-12-27",
    },
    {
      id: 6,
      title: "December 2024 — Bonus run",
      status: "Completed",
      employeeCount: 58,
      amount: "₦3,200,000",
      date: "Dec 20",
      submittedBy: "Ngozi Adeyemi",
      fullDate: "2024-12-20",
    },
  ];

  const filteredRuns = useMemo(() => {
    let filtered = [...paymentRuns];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.submittedBy?.toLowerCase().includes(q),
      );
    }
    if (filters.dateFrom)
      filtered = filtered.filter((r) => r.fullDate >= filters.dateFrom);
    if (filters.dateTo)
      filtered = filtered.filter((r) => r.fullDate <= filters.dateTo);
    if (filters.status.length > 0)
      filtered = filtered.filter((r) => filters.status.includes(r.status));
    return filtered;
  }, [searchQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / PAGE_SIZE_PH));
  const safePage = Math.min(page, totalPages);
  const pageRuns = filteredRuns.slice(
    (safePage - 1) * PAGE_SIZE_PH,
    safePage * PAGE_SIZE_PH,
  );

  const hasActiveFilters =
    filters.status.length > 0 || filters.dateFrom || filters.dateTo;

  const toggleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
    setPage(1);
  };

  return (
    <>
      <div className='search-filter-bar'>
        <div className='search-wrapper'>
          <svg
            className='search-icon'
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'>
            <path
              d='M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z'
              stroke='currentColor'
              strokeWidth='1.2'
              strokeLinecap='round'
            />
            <path
              d='M12.5 12.5L10 10'
              stroke='currentColor'
              strokeWidth='1.2'
              strokeLinecap='round'
            />
          </svg>
          <input
            type='text'
            placeholder='Search payment runs...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className='filter-wrapper'>
          <button
            type='button'
            className={`filter-btn${showFilter ? " active" : ""}${hasActiveFilters ? " has-filters" : ""}`}
            onClick={() => setShowFilter((p) => !p)}>
            <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path
                d='M1.5 3.5H12.5M3.5 7H10.5M5.5 10.5H8.5'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className='filter-count'>
                {filters.status.length +
                  (filters.dateFrom ? 1 : 0) +
                  (filters.dateTo ? 1 : 0)}
              </span>
            )}
          </button>

          {showFilter && (
            <div className='filter-dropdown' style={{ minWidth: 280 }}>
              <div className='filter-dropdown-header'>
                <span className='filter-dropdown-title'>Filter runs</span>
                <button
                  type='button'
                  className='filter-clear-link'
                  onClick={() => {
                    setFilters({ dateFrom: "", dateTo: "", status: [] });
                    setPage(1);
                  }}>
                  Clear all
                </button>
              </div>

              <div className='filter-section'>
                <div className='filter-section-label'>Status</div>
                <div className='filter-chip-group'>
                  {["Completed", "Pending approval", "Rejected"].map((s) => (
                    <button
                      key={s}
                      type='button'
                      className={`filter-chip${filters.status.includes(s) ? " on" : ""}`}
                      onClick={() => toggleStatusFilter(s)}>
                      {filters.status.includes(s) && (
                        <svg
                          width='10'
                          height='10'
                          viewBox='0 0 10 10'
                          fill='none'>
                          <path
                            d='M2 5l2 2 4-4'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className='filter-section' style={{ marginBottom: 0 }}>
                <div className='filter-section-label'>Date range</div>
                <div className='filter-range-row'>
                  <input
                    type='date'
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, dateFrom: e.target.value }))
                    }
                    className='filter-range-input'
                  />
                  <span className='filter-range-sep'>—</span>
                  <input
                    type='date'
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, dateTo: e.target.value }))
                    }
                    className='filter-range-input'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Datatable */}
      <div className='datatable-wrap'>
        <div className='tbl'>
          <div className='th payment-cols'>
            <span>Payment run</span>
            <span>Employees</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Status</span>
            <span></span>
          </div>
          {pageRuns.length === 0 ? (
            <div className='empty-state'>No payment runs found</div>
          ) : (
            pageRuns.map((run) => (
              <div key={run.id} className='tr payment-cols'>
                <span className='run-title'>{run.title}</span>
                <span>{run.employeeCount}</span>
                <span style={{ fontWeight: 500 }}>{run.amount}</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {run.date}
                </span>
                <span>
                  <span
                    className={`sb ${run.status === "Completed" ? "sb-ok" : run.status === "Pending approval" ? "sb-pend" : "sb-rej"}`}>
                    {run.status}
                  </span>
                </span>
                <span>
                  <button
                    type='button'
                    className='view-details-btn'
                    onClick={() => setSelectedRun(run)}>
                    View details
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        <div className='datatable-footer'>
          <span className='datatable-info'>
            {filteredRuns.length === 0
              ? "No results"
              : `${(safePage - 1) * PAGE_SIZE_PH + 1}–${Math.min(safePage * PAGE_SIZE_PH, filteredRuns.length)} of ${filteredRuns.length}`}
          </span>
          <div className='datatable-pages'>
            <button
              type='button'
              className='page-btn'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}>
              <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                <path
                  d='M7.5 2L4 6l3.5 4'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type='button'
                className={`page-btn${p === safePage ? " active" : ""}`}
                onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button
              type='button'
              className='page-btn'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}>
              <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                <path
                  d='M4.5 2L8 6l-3.5 4'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {selectedRun && (
        <PaymentDetailModal
          run={selectedRun}
          onClose={() => setSelectedRun(null)}
        />
      )}
    </>
  );
}

export function NewPaymentRun({ go, employees, walletBalance, approvalOn }) {
  const [internalRunStep, setInternalRunStep] = useState(1);
  return (
    <PaymentTabs
      runStep={internalRunStep}
      setRunStep={setInternalRunStep}
      go={go}
      employees={employees}
      walletBalance={walletBalance}
      approvalOn={approvalOn}
    />
  );
}

// Individual payment entry
function IndividualEntry({ employees, entry, onChange, onRemove, isOnly }) {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = employees.find((e) => e.id === entry.employeeId);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return employees
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, employees]);

  return (
    <div className='ind-entry-card'>
      <div className='ind-entry-header'>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}>
          Recipient
        </span>
        {!isOnly && (
          <button
            type='button'
            className='ind-remove-btn'
            onClick={onRemove}
            title='Remove'>
            <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
              <path
                d='M2 2l8 8M10 2l-8 8'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </button>
        )}
      </div>

      <div className='fg fg-2'>
        <div className='field'>
          <label>Employee</label>
          <div className='searchable-select' style={{ position: "relative" }}>
            {selected ? (
              <div className='ind-selected-emp'>
                <div className='ind-emp-avatar'>
                  {selected.name
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {selected.rank} · {selected.department}
                  </div>
                </div>
                <button
                  type='button'
                  className='ind-change-btn'
                  onClick={() => {
                    onChange({ ...entry, employeeId: "" });
                    setQuery("");
                  }}>
                  Change
                </button>
              </div>
            ) : (
              <>
                <input
                  type='text'
                  placeholder='Search by name or code...'
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  className='searchable-input'
                />
                {dropdownOpen && results.length > 0 && (
                  <>
                    <div
                      className='csel-backdrop'
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className='searchable-dropdown'
                      style={{ zIndex: 200 }}>
                      {results.map((emp) => (
                        <div
                          key={emp.id}
                          className='searchable-option'
                          onClick={() => {
                            onChange({ ...entry, employeeId: emp.id });
                            setQuery("");
                            setDropdownOpen(false);
                          }}>
                          <div
                            className='ind-emp-avatar'
                            style={{ width: 24, height: 24, fontSize: 9 }}>
                            {emp.name
                              .split(/\s+/)
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className='emp-name'>{emp.name}</span>
                          <span className='emp-code'>{emp.code}</span>
                          <span className='emp-rank'>{emp.rank}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {dropdownOpen && query.trim() && results.length === 0 && (
                  <div className='searchable-dropdown'>
                    <div
                      className='empty-state'
                      style={{ padding: "12px 16px" }}>
                      No employees found
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className='field'>
          <label>Amount (₦)</label>
          <input
            type='number'
            value={entry.amount}
            onChange={(e) => onChange({ ...entry, amount: e.target.value })}
            placeholder={
              selected
                ? `Base: ${formatNaira(selected.netSalary)}`
                : "Enter amount"
            }
          />
        </div>
      </div>

      <div className='field'>
        <label>Note (optional)</label>
        <input
          type='text'
          value={entry.note}
          onChange={(e) => onChange({ ...entry, note: e.target.value })}
          placeholder='e.g. travel allowance'
        />
      </div>
    </div>
  );
}

function PaymentTabs({
  runStep,
  setRunStep,
  go,
  employees,
  walletBalance,
  approvalOn,
}) {
  const { addToast } = useToast();
  const [paymentMode, setPaymentMode] = useState("bulk");
  const [previewSearchQuery, setPreviewSearchQuery] = useState("");

  // Individual payments - array of entries
  const [indEntries, setIndEntries] = useState([
    { id: 1, employeeId: "", amount: "", note: "" },
  ]);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.active),
    [employees],
  );
  const availableRanks = useMemo(
    () => Array.from(new Set(activeEmployees.map((e) => e.rank))),
    [activeEmployees],
  );

  const [period, setPeriod] = useState("April 2025");
  const [runType, setRunType] = useState("Salary");
  const [includeMode, setIncludeMode] = useState("all");
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [notes, setNotes] = useState("");

  const [previewEmployees, setPreviewEmployees] = useState([]);
  const [amountByEmpId, setAmountByEmpId] = useState({});

  function setStep(nextStep) {
    if (nextStep === 1) {
      setPreviewEmployees([]);
      setAmountByEmpId({});
      setIndEntries([{ id: 1, employeeId: "", amount: "", note: "" }]);
      setPreviewSearchQuery("");
    }
    setRunStep(nextStep);
  }

  const indTotal = useMemo(
    () => indEntries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [indEntries],
  );

  const previewTotal = useMemo(() => {
    if (paymentMode === "individual") return indTotal;
    return previewEmployees.reduce(
      (sum, emp) => sum + (Number(amountByEmpId[emp.id]) || 0),
      0,
    );
  }, [previewEmployees, amountByEmpId, paymentMode, indTotal]);

  const walletError = previewTotal > walletBalance;

  const ctaDisabled =
    walletError ||
    (paymentMode === "bulk" && previewEmployees.length === 0) ||
    (paymentMode === "individual" &&
      (indEntries.some((e) => !e.employeeId || !e.amount) ||
        indEntries.length === 0));

  const ctaLabel = approvalOn ? "Submit for approval →" : "Make payment now →";

  const targetRanks = useMemo(
    () => (includeMode === "all" ? availableRanks : selectedRanks),
    [includeMode, availableRanks, selectedRanks],
  );

  function toggleRank(rank) {
    setSelectedRanks((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank],
    );
  }

  function loadPreview() {
    const list = activeEmployees.filter((e) => targetRanks.includes(e.rank));
    const initialAmounts = {};
    list.forEach((e) => {
      initialAmounts[e.id] = e.netSalary;
    });
    setPreviewEmployees(list);
    setAmountByEmpId(initialAmounts);
    setRunStep(2);
  }

  function loadIndividualPreview() {
    const valid = indEntries.every((e) => e.employeeId && e.amount);
    if (valid) setRunStep(2);
  }

  const addEntry = () => {
    setIndEntries((prev) => [
      ...prev,
      { id: Date.now(), employeeId: "", amount: "", note: "" },
    ]);
  };

  const removeEntry = (id) => {
    setIndEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id, updated) => {
    setIndEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const filteredPreviewEmployees = useMemo(() => {
    if (!previewSearchQuery.trim()) return previewEmployees;
    const q = previewSearchQuery.toLowerCase();
    return previewEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q),
    );
  }, [previewEmployees, previewSearchQuery]);

  const periodOptions = [
    { value: "April 2025", label: "April 2025" },
    { value: "March 2025", label: "March 2025" },
    { value: "February 2025", label: "February 2025" },
    { value: "January 2025", label: "January 2025" },
    { value: "December 2024", label: "December 2024" },
  ];

  const runTypeOptions = [
    { value: "Salary", label: "Salary", description: "Regular monthly salary" },
    {
      value: "Bonus",
      label: "Bonus",
      description: "Performance or ad-hoc bonus",
    },
    {
      value: "Allowance",
      label: "Allowance",
      description: "Transport, housing or other allowances",
    },
    {
      value: "Severance",
      label: "Severance",
      description: "Exit package or severance pay",
    },
    {
      value: "Pension",
      label: "Pension",
      description: "Pension/retirement contribution",
    },
  ];

  const includeModeOptions = [
    {
      value: "all",
      label: "All active employees",
      description: "Include everyone currently active",
    },
    {
      value: "specific",
      label: "Specific ranks only",
      description: "Choose which ranks to include",
    },
  ];

  return (
    <>
      <div className='payment-mode-toggle'>
        <button
          type='button'
          className={`mode-btn${paymentMode === "bulk" ? " active" : ""}`}
          onClick={() => {
            setPaymentMode("bulk");
            setStep(1);
          }}>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
            <path
              d='M1 3h12M1 7h12M1 11h12'
              stroke='currentColor'
              strokeWidth='1.3'
              strokeLinecap='round'
            />
          </svg>
          Bulk payment
        </button>
        <button
          type='button'
          className={`mode-btn${paymentMode === "individual" ? " active" : ""}`}
          onClick={() => {
            setPaymentMode("individual");
            setStep(1);
          }}>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
            <circle
              cx='5'
              cy='4.5'
              r='2.5'
              stroke='currentColor'
              strokeWidth='1.3'
            />
            <path
              d='M1 12c0-2 1.5-4 4-4'
              stroke='currentColor'
              strokeWidth='1.3'
              strokeLinecap='round'
            />
            <path
              d='M10 8v4M8 10h4'
              stroke='currentColor'
              strokeWidth='1.3'
              strokeLinecap='round'
            />
          </svg>
          Individual payment
        </button>
      </div>

      <div className='nps'>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type='button'
            className={`npt${runStep === n ? " on" : ""}`}
            onClick={() => setStep(n)}>
            {n === 1 ? "1. Details" : n === 2 ? "2. Preview" : "3. Done"}
          </button>
        ))}
      </div>

      {runStep === 1 && (
        <>
          <div className='form-card'>
            <div className='fc-title'>Payment run details</div>

            <div className='fg fg-2'>
              <div className='field'>
                <label>Period</label>
                <CustomSelect
                  value={period}
                  onChange={setPeriod}
                  options={periodOptions}
                />
              </div>
              <div className='field'>
                <label>Payment type</label>
                <CustomSelect
                  value={runType}
                  onChange={setRunType}
                  options={runTypeOptions}
                />
              </div>
            </div>

            {paymentMode === "bulk" ? (
              <>
                <div className='fg fg-2'>
                  <div className='field'>
                    <label>Include</label>
                    <CustomSelect
                      value={includeMode}
                      onChange={setIncludeMode}
                      options={includeModeOptions}
                    />
                  </div>
                  <div className='field'>
                    <label>Notes (optional)</label>
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder='e.g. end of term bonus'
                    />
                  </div>
                </div>

                {includeMode === "specific" && (
                  <div style={{ marginTop: 10 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 8,
                      }}>
                      Choose ranks to include
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {availableRanks.map((r) => (
                        <button
                          key={r}
                          type='button'
                          className={`pill${selectedRanks.includes(r) ? " on" : ""}`}
                          onClick={() => toggleRank(r)}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className='field'>
                  <label>Notes (optional)</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder='e.g. bonus payment'
                  />
                </div>
              </>
            )}
          </div>

          {/* Individual entries */}
          {paymentMode === "individual" && (
            <>
              <div className='ind-entries-list'>
                {indEntries.map((entry) => (
                  <IndividualEntry
                    key={entry.id}
                    employees={activeEmployees}
                    entry={entry}
                    onChange={(updated) => updateEntry(entry.id, updated)}
                    onRemove={() => removeEntry(entry.id)}
                    isOnly={indEntries.length === 1}
                  />
                ))}
              </div>
              <button type='button' className='ind-add-btn' onClick={addEntry}>
                <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                  <circle
                    cx='7'
                    cy='7'
                    r='6'
                    stroke='currentColor'
                    strokeWidth='1.3'
                  />
                  <path
                    d='M7 4v6M4 7h6'
                    stroke='currentColor'
                    strokeWidth='1.3'
                    strokeLinecap='round'
                  />
                </svg>
                Add another recipient
              </button>

              {indEntries.some((e) => e.employeeId && e.amount) && (
                <div className='ind-summary'>
                  <span>
                    {indEntries.filter((e) => e.employeeId && e.amount).length}{" "}
                    recipient(s)
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--positive)" }}>
                    {formatNaira(indTotal)} total
                  </span>
                </div>
              )}
            </>
          )}

          <button
            type='button'
            className='tb-btn primary'
            style={{ padding: "9px 18px", marginTop: 4 }}
            onClick={
              paymentMode === "bulk" ? loadPreview : loadIndividualPreview
            }
            disabled={
              (paymentMode === "bulk" &&
                (activeEmployees.length === 0 ||
                  (includeMode === "specific" &&
                    selectedRanks.length === 0))) ||
              (paymentMode === "individual" &&
                indEntries.some((e) => !e.employeeId || !e.amount))
            }>
            Continue to preview →
          </button>
        </>
      )}

      {runStep === 2 && (
        <>
          <div className='total-bar'>
            <span>Total disbursement</span>
            <span
              style={{
                color: walletError ? "var(--danger)" : "var(--positive)",
              }}>
              {formatNaira(previewTotal)}
            </span>
          </div>

          {walletError && (
            <div
              className='info-box'
              style={{
                marginBottom: 12,
                borderLeft: "3px solid var(--danger)",
              }}>
              Preview total {formatNaira(previewTotal)} exceeds wallet balance{" "}
              {formatNaira(walletBalance)}.
            </div>
          )}

          {/* Preview search */}
          {paymentMode === "bulk" && previewEmployees.length > 5 && (
            <div className='preview-search'>
              <div className='search-wrapper' style={{ maxWidth: 320 }}>
                <svg
                  className='search-icon'
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'>
                  <path
                    d='M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z'
                    stroke='currentColor'
                    strokeWidth='1.2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M12.5 12.5L10 10'
                    stroke='currentColor'
                    strokeWidth='1.2'
                    strokeLinecap='round'
                  />
                </svg>
                <input
                  type='text'
                  placeholder='Search employees in preview...'
                  value={previewSearchQuery}
                  onChange={(e) => setPreviewSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMode === "individual" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {indEntries
                .filter((e) => e.employeeId && e.amount)
                .map((entry) => {
                  const emp = activeEmployees.find(
                    (e) => e.id === entry.employeeId,
                  );
                  if (!emp) return null;
                  return (
                    <div key={entry.id} className='preview-block'>
                      <div className='pr-head'>
                        <span>
                          {emp.name}{" "}
                          <span
                            style={{
                              color: "var(--text-secondary)",
                              fontWeight: 400,
                            }}>
                            ({emp.rank} · {emp.department})
                          </span>
                        </span>
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                          }}>
                          {formatNaira(emp.netSalary)} base
                        </span>
                      </div>
                      <div className='pr-row'>
                        <span style={{ color: "var(--text-secondary)" }}>
                          Payment amount
                        </span>
                        <span
                          style={{ fontWeight: 600, color: "var(--positive)" }}>
                          {formatNaira(entry.amount)}
                        </span>
                      </div>
                      {entry.note && (
                        <div className='pr-row'>
                          <span style={{ color: "var(--text-secondary)" }}>
                            Note
                          </span>
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontStyle: "italic",
                            }}>
                            {entry.note}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredPreviewEmployees.length === 0 ? (
                <div className='empty-state'>
                  No employees match your search
                </div>
              ) : (
                filteredPreviewEmployees.map((emp) => {
                  const value =
                    amountByEmpId[emp.id] !== undefined
                      ? amountByEmpId[emp.id]
                      : "";
                  return (
                    <div key={emp.id} className='preview-block'>
                      <div className='pr-head'>
                        <span>
                          {emp.name}{" "}
                          <span
                            style={{
                              color: "var(--text-secondary)",
                              fontWeight: 400,
                            }}>
                            ({emp.rank} · {emp.department})
                          </span>
                        </span>
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                          }}>
                          {formatNaira(emp.netSalary)} base
                        </span>
                      </div>
                      <div className='pr-row'>
                        <span style={{ color: "var(--text-secondary)" }}>
                          Payment amount
                        </span>
                        <span>
                          <input
                            type='number'
                            value={value === "" ? "" : value}
                            onChange={(e) => {
                              const next =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);
                              setAmountByEmpId((prev) => ({
                                ...prev,
                                [emp.id]:
                                  next === ""
                                    ? ""
                                    : Number.isFinite(next)
                                      ? next
                                      : 0,
                              }));
                            }}
                            placeholder='Enter amount'
                            style={{
                              width: 140,
                              padding: "7px 10px",
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              background: "var(--surface-white)",
                              color: "var(--text)",
                              outline: "none",
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type='button' className='tb-btn' onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              type='button'
              className='tb-btn primary'
              onClick={() => {
                addToast(
                  approvalOn ? "Run submitted for approval" : "Payments made",
                  "success",
                );
                setStep(3);
              }}
              disabled={ctaDisabled}
              style={
                ctaDisabled
                  ? { opacity: 0.65, cursor: "not-allowed" }
                  : undefined
              }>
              {ctaLabel}
            </button>
          </div>
        </>
      )}

      {runStep === 3 && (
        <div className='ap-card' style={{ textAlign: "center", padding: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              color: "var(--accent)",
            }}>
            <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
              <path
                d='M4 11l5 5 9-9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          {!approvalOn ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Payment completed
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 16,
                }}>
                All payments were processed (demo).
              </p>
              <button
                type='button'
                className='tb-btn primary'
                onClick={() => {
                  setRunStep(1);
                  go("overview");
                }}>
                Go to dashboard →
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Run submitted
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 16,
                }}>
                Finance has been notified (demo — no backend).
              </p>
              <button
                type='button'
                className='tb-btn primary'
                onClick={() => {
                  setRunStep(1);
                  go("approvals");
                }}>
                View approval status →
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default PaymentHistory;
