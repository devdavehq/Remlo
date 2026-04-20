import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";
import { IconEdit } from "../../icons/icons";

const PAYMENT_HISTORY = [
  {
    id: 1,
    period: "March 2025",
    gross: 300000,
    net: 253500,
    status: "Sent",
    date: "Mar 27, 2025",
    type: "Salary",
    method: "Direct transfer",
  },
  {
    id: 2,
    period: "February 2025",
    gross: 300000,
    net: 253500,
    status: "Sent",
    date: "Feb 26, 2025",
    type: "Salary",
    method: "Direct transfer",
  },
  {
    id: 3,
    period: "January 2025",
    gross: 300000,
    net: 253500,
    status: "Sent",
    date: "Jan 28, 2025",
    type: "Salary",
    method: "Direct transfer",
  },
  {
    id: 4,
    period: "December 2024",
    gross: 300000,
    net: 253500,
    status: "Sent",
    date: "Dec 27, 2024",
    type: "Salary",
    method: "Direct transfer",
  },
  {
    id: 5,
    period: "December 2024",
    gross: 150000,
    net: 150000,
    status: "Sent",
    date: "Dec 20, 2024",
    type: "Bonus",
    method: "Direct transfer",
  },
  {
    id: 6,
    period: "November 2024",
    gross: 300000,
    net: 253500,
    status: "Sent",
    date: "Nov 27, 2024",
    type: "Salary",
    method: "Direct transfer",
  },
];

const PH_PAGE_SIZE = 4;

export default function Empdetail({
  selectedEmployeeId,
  employees,
  setEmployees,
}) {
  const { addToast } = useToast();
  const [phPage, setPhPage] = useState(1);
  const [phSearch, setPhSearch] = useState("");

  function formatNaira(value) {
    const n = Number(value) || 0;
    return `₦${n.toLocaleString("en-NG")}`;
  }

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [employees, selectedEmployeeId]);

  const filteredPH = useMemo(() => {
    if (!phSearch.trim()) return PAYMENT_HISTORY;
    const q = phSearch.toLowerCase();
    return PAYMENT_HISTORY.filter(
      (p) =>
        p.period.toLowerCase().includes(q) || p.type.toLowerCase().includes(q),
    );
  }, [phSearch]);

  const totalPhPages = Math.max(1, Math.ceil(filteredPH.length / PH_PAGE_SIZE));
  const safePhPage = Math.min(phPage, totalPhPages);
  const pagePH = filteredPH.slice(
    (safePhPage - 1) * PH_PAGE_SIZE,
    safePhPage * PH_PAGE_SIZE,
  );

  // Stats
  const totalPaid = PAYMENT_HISTORY.filter((p) => p.status === "Sent").reduce(
    (sum, p) => sum + p.net,
    0,
  );
  const lastPayment = PAYMENT_HISTORY[0];

  return (
    <>
      {/* Employee Header */}
      <div className='emp-header'>
        <div className='avatar'>
          {selectedEmployee.name
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {selectedEmployee.name}
          </div>
          <div className='emp-meta'>
            {selectedEmployee.code} · {selectedEmployee.rank} ·{" "}
            {selectedEmployee.department}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
          <button
            type='button'
            className='icon-action-btn edit'
            style={{
              width: "auto",
              padding: "6px 12px",
              gap: 6,
              display: "flex",
              alignItems: "center",
            }}>
            <IconEdit />
            <span style={{ fontSize: 12 }}>Edit</span>
          </button>
          <button
            type='button'
            className='tb-btn'
            style={{
              color: selectedEmployee.active
                ? "var(--danger)"
                : "var(--positive)",
              borderColor: "var(--border)",
            }}
            onClick={() => {
              const nextActive = !selectedEmployee.active;
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === selectedEmployee.id
                    ? { ...e, active: !e.active }
                    : e,
                ),
              );
              addToast(
                nextActive ? "Employee activated" : "Employee deactivated",
                nextActive ? "success" : "error",
              );
            }}>
            {selectedEmployee.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className='ed-grid'>
        <div className='ed-card'>
          <div className='ed-title'>Personal information</div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Email</span>
            <span style={{ fontWeight: 500 }}>
              {selectedEmployee.name.replace(/\s+/g, ".").toLowerCase()}
              @school.edu.ng
            </span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Phone</span>
            <span>{selectedEmployee.phone || "—"}</span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Date hired</span>
            <span>
              {selectedEmployee.dateHired
                ? new Date(selectedEmployee.dateHired).toLocaleDateString(
                    "en-NG",
                    { year: "numeric", month: "short", day: "numeric" },
                  )
                : "—"}
            </span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Status</span>
            <span
              className={`sb${selectedEmployee.active ? " sb-ok" : " sb-rej"}`}>
              {selectedEmployee.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className='ed-card'>
          <div className='ed-title'>Compensation</div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Gross salary</span>
            <span style={{ fontWeight: 500 }}>
              {formatNaira(selectedEmployee.netSalary)}
            </span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>
              Net pay (est.)
            </span>
            <span style={{ color: "var(--positive)", fontWeight: 600 }}>
              {formatNaira(Math.round(selectedEmployee.netSalary * 0.845))}
            </span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>
              Total paid (6mo)
            </span>
            <span style={{ fontWeight: 500 }}>{formatNaira(totalPaid)}</span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Last payment</span>
            <span style={{ color: "var(--text-muted)" }}>
              {lastPayment?.date || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}>
          <div className='sec-title' style={{ margin: 0 }}>
            Payment history
          </div>
          <div
            className='search-wrapper'
            style={{ maxWidth: 220, flex: "none" }}>
            <svg
              className='search-icon'
              width='13'
              height='13'
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
              placeholder='Search history...'
              value={phSearch}
              onChange={(e) => {
                setPhSearch(e.target.value);
                setPhPage(1);
              }}
              style={{ fontSize: 11 }}
            />
          </div>
        </div>

        <div className='datatable-wrap'>
          <div className='tbl'>
            <div
              className='th'
              style={{
                gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr",
                display: "grid",
                padding: "8px 14px",
              }}>
              <span>Period</span>
              <span>Type</span>
              <span>Gross</span>
              <span>Net paid</span>
              <span>Method</span>
              <span>Status</span>
            </div>
            {pagePH.length === 0 ? (
              <div className='empty-state'>No payment records found</div>
            ) : (
              pagePH.map((p) => (
                <div
                  key={p.id}
                  className='tr'
                  style={{
                    gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr",
                    display: "grid",
                    padding: "9px 14px",
                  }}>
                  <span>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>
                      {p.period}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {p.date}
                    </div>
                  </span>
                  <span>
                    <span className='rtag' style={{ fontSize: 10 }}>
                      {p.type}
                    </span>
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {formatNaira(p.gross)}
                  </span>
                  <span style={{ color: "var(--positive)", fontWeight: 600 }}>
                    {formatNaira(p.net)}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {p.method}
                  </span>
                  <span>
                    <span className='sb sb-ok'>{p.status}</span>
                  </span>
                </div>
              ))
            )}
          </div>

          <div className='datatable-footer'>
            <span className='datatable-info'>
              {filteredPH.length === 0
                ? "No results"
                : `${(safePhPage - 1) * PH_PAGE_SIZE + 1}–${Math.min(safePhPage * PH_PAGE_SIZE, filteredPH.length)} of ${filteredPH.length}`}
            </span>
            <div className='datatable-pages'>
              <button
                type='button'
                className='page-btn'
                onClick={() => setPhPage((p) => Math.max(1, p - 1))}
                disabled={safePhPage === 1}>
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
              {Array.from({ length: totalPhPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    type='button'
                    className={`page-btn${p === safePhPage ? " active" : ""}`}
                    onClick={() => setPhPage(p)}>
                    {p}
                  </button>
                ),
              )}
              <button
                type='button'
                className='page-btn'
                onClick={() => setPhPage((p) => Math.min(totalPhPages, p + 1))}
                disabled={safePhPage === totalPhPages}>
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
      </div>
    </>
  );
}
