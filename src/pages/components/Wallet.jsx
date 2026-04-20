import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export default function Wallet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: [],
  });

  const transactions = [
    {
      id: 1,
      title: "March salary run",
      date: "Mar 27",
      rawDate: "2025-03-27",
      amount: -12400000,
      type: "payment",
    },
    {
      id: 2,
      title: "Wallet funded",
      date: "Mar 20",
      rawDate: "2025-03-20",
      amount: 5000000,
      type: "funding",
    },
    {
      id: 3,
      title: "February salary run",
      date: "Feb 26",
      rawDate: "2025-02-26",
      amount: -11900000,
      type: "payment",
    },
    {
      id: 4,
      title: "Wallet funded",
      date: "Feb 15",
      rawDate: "2025-02-15",
      amount: 5000000,
      type: "funding",
    },
    {
      id: 5,
      title: "January salary run",
      date: "Jan 28",
      rawDate: "2025-01-28",
      amount: -11500000,
      type: "payment",
    },
    {
      id: 6,
      title: "Wallet funded",
      date: "Jan 10",
      rawDate: "2025-01-10",
      amount: 5000000,
      type: "funding",
    },
    {
      id: 7,
      title: "December salary run",
      date: "Dec 27",
      rawDate: "2024-12-27",
      amount: -11200000,
      type: "payment",
    },
    {
      id: 8,
      title: "December bonus run",
      date: "Dec 20",
      rawDate: "2024-12-20",
      amount: -3200000,
      type: "payment",
    },
    {
      id: 9,
      title: "Wallet funded",
      date: "Dec 10",
      rawDate: "2024-12-10",
      amount: 8000000,
      type: "funding",
    },
    {
      id: 10,
      title: "November salary run",
      date: "Nov 28",
      rawDate: "2024-11-28",
      amount: -11000000,
      type: "payment",
    },
  ];

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (filters.dateFrom)
      filtered = filtered.filter((t) => t.rawDate >= filters.dateFrom);
    if (filters.dateTo)
      filtered = filtered.filter((t) => t.rawDate <= filters.dateTo);
    if (filters.type.length > 0)
      filtered = filtered.filter((t) => filters.type.includes(t.type));
    return filtered;
  }, [searchQuery, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageTx = filteredTransactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const toggleTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
    setPage(1);
  };

  const hasActiveFilters =
    filters.type.length > 0 || filters.dateFrom || filters.dateTo;
  const totalBalance = 4200000;

  return (
    <>
      <div className='wallet-hero'>
        <div className='wh-label'>Available balance</div>
        <div className='wh-amt'>₦{totalBalance.toLocaleString("en-NG")}</div>
        <div className='wh-sub'>Last funded Mar 20 · ₦5,000,000</div>
        <div className='wh-actions'>
          <button type='button'>+ Fund wallet</button>
          <button type='button'>Set alert</button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}>
        <div className='sec-title' style={{ margin: 0 }}>
          Transactions
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {filteredTransactions.length} records
        </div>
      </div>

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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder='Search transactions...'
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
                {filters.type.length +
                  (filters.dateFrom ? 1 : 0) +
                  (filters.dateTo ? 1 : 0)}
              </span>
            )}
          </button>

          {showFilter && (
            <div className='filter-dropdown' style={{ minWidth: 260 }}>
              <div className='filter-dropdown-header'>
                <span className='filter-dropdown-title'>
                  Filter transactions
                </span>
                <button
                  type='button'
                  className='filter-clear-link'
                  onClick={() => {
                    setFilters({ dateFrom: "", dateTo: "", type: [] });
                    setPage(1);
                  }}>
                  Clear all
                </button>
              </div>

              <div className='filter-section'>
                <div className='filter-section-label'>Type</div>
                <div className='filter-chip-group'>
                  {[
                    { value: "payment", label: "Payments" },
                    { value: "funding", label: "Funding" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type='button'
                      className={`filter-chip${filters.type.includes(value) ? " on" : ""}`}
                      onClick={() => toggleTypeFilter(value)}>
                      {filters.type.includes(value) && (
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
                      {label}
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

      {/* Scrollable datatable */}
      <div className='datatable-wrap wallet-tx-table'>
        <div className='tbl'>
          <div
            className='th'
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 14px",
            }}>
            <span>Transaction</span>
            <span>Amount</span>
          </div>
          {pageTx.length === 0 ? (
            <div className='empty-state'>No transactions found</div>
          ) : (
            pageTx.map((tx) => (
              <div
                key={tx.id}
                className='tr'
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  cursor: "default",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className={`tx-icon-wrap${tx.amount > 0 ? " tx-in" : " tx-out"}`}>
                    {tx.amount > 0 ? (
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'>
                        <path
                          d='M6 10V2M3 5l3-3 3 3'
                          stroke='currentColor'
                          strokeWidth='1.4'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'>
                        <path
                          d='M6 2v8M3 7l3 3 3-3'
                          stroke='currentColor'
                          strokeWidth='1.4'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text)",
                        fontWeight: 500,
                      }}>
                      {tx.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {tx.date}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: tx.amount > 0 ? "var(--positive)" : "var(--danger)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                  {tx.amount > 0
                    ? `+₦${tx.amount.toLocaleString("en-NG")}`
                    : `−₦${Math.abs(tx.amount).toLocaleString("en-NG")}`}
                </div>
              </div>
            ))
          )}
        </div>

        <div className='datatable-footer'>
          <span className='datatable-info'>
            {filteredTransactions.length === 0
              ? "No results"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredTransactions.length)} of ${filteredTransactions.length}`}
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
    </>
  );
}
