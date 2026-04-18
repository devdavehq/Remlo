import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";

function formatNaira(value) {
  const n = Number(value) || 0;
  return `₦${n.toLocaleString("en-NG")}`;
}

function PaymentDetailModal({ run, onClose }) {
  if (!run) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>{run.title}</h3>
          <button className='modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='detail-row'>
            <span>Status:</span>
            <span
              className={`sb ${run.status === "Completed" ? "sb-ok" : run.status === "Pending approval" ? "sb-pend" : "sb-rej"}`}>
              {run.status}
            </span>
          </div>
          <div className='detail-row'>
            <span>Submitted by:</span>
            <span>{run.submittedBy || "Ngozi Adeyemi"}</span>
          </div>
          <div className='detail-row'>
            <span>Date:</span>
            <span>{run.date}</span>
          </div>
          <div className='detail-row'>
            <span>Employees:</span>
            <span>{run.employeeCount} employees</span>
          </div>
          <div className='detail-row'>
            <span>Total amount:</span>
            <span className='amount'>{run.amount}</span>
          </div>
          {run.breakdown && (
            <div className='breakdown'>
              <div className='breakdown-title'>Breakdown</div>
              {run.breakdown.map((item, i) => (
                <div key={i} className='breakdown-row'>
                  <span>{item.label}</span>
                  <span>{item.amount}</span>
                </div>
              ))}
            </div>
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
  ];

  const filteredRuns = useMemo(() => {
    let filtered = [...paymentRuns];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => r.title.toLowerCase().includes(query));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((r) => r.fullDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((r) => r.fullDate <= filters.dateTo);
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter((r) => filters.status.includes(r.status));
    }

    return filtered;
  }, [paymentRuns, searchQuery, filters]);

  const toggleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='filter-wrapper'>
          <button
            type='button'
            className={`filter-btn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}>
            <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path
                d='M1.5 3.5H12.5M3.5 7H10.5M5.5 10.5H8.5'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
              />
            </svg>
            Filter
          </button>
          {showFilter && (
            <div className='filter-dropdown'>
              <div className='filter-group'>
                <label>Date from</label>
                <input
                  type='date'
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='filter-group'>
                <label>Date to</label>
                <input
                  type='date'
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                />
              </div>
              <div className='filter-group'>
                <label>Status</label>
                <div className='checkbox-group'>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.status.includes("Completed")}
                      onChange={() => toggleStatusFilter("Completed")}
                    />
                    <span>Completed</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.status.includes("Pending approval")}
                      onChange={() => toggleStatusFilter("Pending approval")}
                    />
                    <span>Pending approval</span>
                  </label>
                </div>
              </div>
              <button
                type='button'
                className='clear-filters'
                onClick={() =>
                  setFilters({ dateFrom: "", dateTo: "", status: [] })
                }>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='tbl'>
        <div className='th payment-cols'>
          <span>Payment run</span>
          <span>Employees</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>
        {filteredRuns.map((run) => (
          <div key={run.id} className='tr payment-cols'>
            <span className='run-title'>{run.title}</span>
            <span>{run.employeeCount}</span>
            <span>{run.amount}</span>
            <span>{run.date}</span>
            <span>
              <span
                className={`sb ${run.status === "Completed" ? "sb-ok" : "sb-pend"}`}>
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
        ))}
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
  // Move the runStep state inside this component
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
  const [searchQuery, setSearchQuery] = useState("");
  const [previewSearchQuery, setPreviewSearchQuery] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [individualAmount, setIndividualAmount] = useState("");

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.active),
    [employees],
  );
  const availableRanks = useMemo(
    () => Array.from(new Set(activeEmployees.map((e) => e.rank))),
    [activeEmployees],
  );

  const [period, setPeriod] = useState("March 2025");
  const [runType, setRunType] = useState("Salary");
  const [includeMode, setIncludeMode] = useState("all");
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [notes, setNotes] = useState("");

  const [previewEmployees, setPreviewEmployees] = useState([]);
  const [amountByEmpId, setAmountByEmpId] = useState({});

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return activeEmployees;
    const query = searchQuery.toLowerCase();
    return activeEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.code.toLowerCase().includes(query),
    );
  }, [activeEmployees, searchQuery]);

  function setStep(nextStep) {
    if (nextStep === 1) {
      setPreviewEmployees([]);
      setAmountByEmpId({});
      setSelectedEmployeeId("");
      setIndividualAmount("");
      setPreviewSearchQuery("");
    }
    setRunStep(nextStep);
  }

  const previewTotal = useMemo(() => {
    if (paymentMode === "individual") {
      return Number(individualAmount) || 0;
    }
    return previewEmployees.reduce((sum, emp) => {
      const v = Number(amountByEmpId[emp.id]) || 0;
      return sum + v;
    }, 0);
  }, [previewEmployees, amountByEmpId, paymentMode, individualAmount]);

  const walletError = previewTotal > walletBalance;
  const ctaDisabled =
    walletError ||
    (paymentMode === "bulk" && previewEmployees.length === 0) ||
    (paymentMode === "individual" &&
      (!selectedEmployeeId || !individualAmount));
  const ctaLabel = approvalOn ? "Submit for approval →" : "Make payment now →";

  const targetRanks = useMemo(() => {
    if (includeMode === "all") return availableRanks;
    return selectedRanks;
  }, [includeMode, availableRanks, selectedRanks]);

  function toggleRank(rank) {
    setSelectedRanks((prev) => {
      if (prev.includes(rank)) return prev.filter((r) => r !== rank);
      return [...prev, rank];
    });
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
    const employee = activeEmployees.find((e) => e.id === selectedEmployeeId);
    if (employee && individualAmount) {
      setRunStep(2);
    }
  }

  const selectedEmployee = activeEmployees.find(
    (e) => e.id === selectedEmployeeId,
  );

  return (
    <>
      <div className='payment-mode-toggle'>
        <button
          type='button'
          className={`mode-btn ${paymentMode === "bulk" ? "active" : ""}`}
          onClick={() => setPaymentMode("bulk")}>
          Bulk payment
        </button>
        <button
          type='button'
          className={`mode-btn ${paymentMode === "individual" ? "active" : ""}`}
          onClick={() => setPaymentMode("individual")}>
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
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}>
                  <option>March 2025</option>
                  <option>April 2025</option>
                </select>
              </div>
              <div className='field'>
                <label>Type</label>
                <select
                  value={runType}
                  onChange={(e) => setRunType(e.target.value)}>
                  <option>Salary</option>
                  <option>Bonus</option>
                  <option>Allowance</option>
                </select>
              </div>
            </div>

            {paymentMode === "bulk" ? (
              <>
                <div className='fg fg-2'>
                  <div className='field'>
                    <label>Include ranks</label>
                    <select
                      value={includeMode}
                      onChange={(e) => setIncludeMode(e.target.value)}>
                      <option value='all'>All active ranks</option>
                      <option value='specific'>Specific ranks</option>
                    </select>
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
                      Choose ranks
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
                <div className='fg fg-2'>
                  <div className='field'>
                    <label>Select employee</label>
                    <div className='searchable-select'>
                      <input
                        type='text'
                        placeholder='Search employee by name or code...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='searchable-input'
                      />
                      <div className='searchable-dropdown'>
                        {filteredEmployees.map((emp) => (
                          <div
                            key={emp.id}
                            className={`searchable-option ${selectedEmployeeId === emp.id ? "selected" : ""}`}
                            onClick={() => setSelectedEmployeeId(emp.id)}>
                            <span className='emp-name'>{emp.name}</span>
                            <span className='emp-code'>{emp.code}</span>
                            <span className='emp-rank'>{emp.rank}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='field'>
                    <label>Payment amount (₦)</label>
                    <input
                      type='number'
                      value={individualAmount}
                      onChange={(e) => setIndividualAmount(e.target.value)}
                      placeholder='Enter amount'
                    />
                  </div>
                </div>
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

          <button
            type='button'
            className='tb-btn primary'
            style={{ padding: "9px 18px" }}
            onClick={
              paymentMode === "bulk" ? loadPreview : loadIndividualPreview
            }
            disabled={
              (paymentMode === "bulk" &&
                (activeEmployees.length === 0 ||
                  (includeMode === "specific" &&
                    selectedRanks.length === 0))) ||
              (paymentMode === "individual" &&
                (!selectedEmployeeId || !individualAmount))
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
              Preview total {formatNaira(previewTotal)} is more than wallet
              balance {formatNaira(walletBalance)}.
            </div>
          )}

          {paymentMode === "individual" && selectedEmployee ? (
            <div className='preview-block'>
              <div className='pr-head'>
                <span>
                  {selectedEmployee.name}{" "}
                  <span
                    style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                    ({selectedEmployee.rank} · {selectedEmployee.department})
                  </span>
                </span>
                <span
                  style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                  {formatNaira(selectedEmployee.netSalary)} base
                </span>
              </div>
              <div className='pr-row'>
                <span style={{ color: "var(--text-secondary)" }}>
                  Payment amount
                </span>
                <span>
                  <input
                    type='number'
                    value={individualAmount}
                    onChange={(e) => setIndividualAmount(e.target.value)}
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
          ) : (
            <>
              <div className='preview-search'>
                <input
                  type='text'
                  placeholder='Search employee...'
                  value={previewSearchQuery}
                  onChange={(e) => setPreviewSearchQuery(e.target.value)}
                  className='preview-search-input'
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {previewEmployees
                  .filter(
                    (e) =>
                      !previewSearchQuery ||
                      e.name
                        .toLowerCase()
                        .includes(previewSearchQuery.toLowerCase()) ||
                      e.code
                        .toLowerCase()
                        .includes(previewSearchQuery.toLowerCase()),
                  )
                  .map((emp) => {
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
                  })}
              </div>
            </>
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
