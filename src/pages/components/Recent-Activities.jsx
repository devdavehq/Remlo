import { useMemo, useState } from "react";

const ACTIVITIES = [
  {
    id: 1,
    text: "March salary run completed — 63 payments sent",
    time: "Today 11:32am",
    type: "payment",
    date: "2025-03-27",
  },
  {
    id: 2,
    text: "Bonus run #012 submitted — waiting for Chidi",
    time: "Today 9:15am",
    type: "submission",
    date: "2025-03-27",
  },
  {
    id: 3,
    text: "Chidi Obi accepted his team invite",
    time: "Yesterday",
    type: "team",
    date: "2025-03-26",
  },
  {
    id: 4,
    text: "4 new teachers added via bulk import",
    time: "Mar 24",
    type: "employee",
    date: "2025-03-24",
  },
  {
    id: 5,
    text: "Wallet balance low — topped up ₦5,000,000",
    time: "Mar 20",
    type: "wallet",
    date: "2025-03-20",
  },
  {
    id: 6,
    text: "New employee: Amaka Osei added",
    time: "Mar 19",
    type: "employee",
    date: "2025-03-19",
  },
  {
    id: 7,
    text: "February salary run completed — 61 payments",
    time: "Feb 26",
    type: "payment",
    date: "2025-02-26",
  },
  {
    id: 8,
    text: "Payroll settings updated",
    time: "Feb 20",
    type: "settings",
    date: "2025-02-20",
  },
  {
    id: 9,
    text: "Halima Musa promoted to HOD",
    time: "Feb 14",
    type: "employee",
    date: "2025-02-14",
  },
  {
    id: 10,
    text: "January salary run completed — 60 payments",
    time: "Jan 28",
    type: "payment",
    date: "2025-01-28",
  },
];

const DOT_COLORS = {
  payment: "p",
  submission: "w",
  team: "n",
  employee: "p",
  wallet: "e",
  settings: "w",
};

const TYPE_LABELS = {
  payment: "Payments",
  submission: "Submissions",
  employee: "Employees",
  team: "Team",
  wallet: "Wallet",
  settings: "Settings",
};

const PAGE_SIZE = 6;

export default function RecentActivities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: [],
  });

  const filteredActivities = useMemo(() => {
    let filtered = [...ACTIVITIES];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.text.toLowerCase().includes(q));
    }
    if (filters.dateFrom)
      filtered = filtered.filter((a) => a.date >= filters.dateFrom);
    if (filters.dateTo)
      filtered = filtered.filter((a) => a.date <= filters.dateTo);
    if (filters.type.length > 0)
      filtered = filtered.filter((a) => filters.type.includes(a.type));
    return filtered;
  }, [searchQuery, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageActivities = filteredActivities.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters =
    filters.type.length > 0 || filters.dateFrom || filters.dateTo;

  const toggleTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
    setPage(1);
  };

  const getDotColor = (type) => DOT_COLORS[type] || "n";

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
            placeholder='Search activities...'
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
                {filters.type.length +
                  (filters.dateFrom ? 1 : 0) +
                  (filters.dateTo ? 1 : 0)}
              </span>
            )}
          </button>

          {showFilter && (
            <div className='filter-dropdown' style={{ minWidth: 280 }}>
              <div className='filter-dropdown-header'>
                <span className='filter-dropdown-title'>Filter activities</span>
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
                <div className='filter-section-label'>Activity type</div>
                <div className='filter-chip-group'>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
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

      <div className='datatable-wrap'>
        <div
          className='act-list'
          style={{
            borderRadius: "10px 10px 0 0",
            border: "1px solid var(--border-subtle)",
            overflow: "hidden",
          }}>
          {pageActivities.length === 0 ? (
            <div className='empty-state'>No activities found</div>
          ) : (
            pageActivities.map((act) => (
              <div key={act.id} className='act-row'>
                <div className={`dot ${getDotColor(act.type)}`} />
                <div style={{ flex: 1 }}>
                  <div className='act-txt'>{act.text}</div>
                  {filters.type.length === 0 && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        marginTop: 1,
                      }}>
                      {TYPE_LABELS[act.type] || act.type}
                    </div>
                  )}
                </div>
                <div className='act-t'>{act.time}</div>
              </div>
            ))
          )}
        </div>

        <div className='datatable-footer'>
          <span className='datatable-info'>
            {filteredActivities.length === 0
              ? "No results"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredActivities.length)} of ${filteredActivities.length}`}
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
