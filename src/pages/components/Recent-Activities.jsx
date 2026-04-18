import { useMemo, useState } from "react";

// Move static data outside component to avoid recreation on each render
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
];

// Color mapping - also static
const DOT_COLORS = {
  payment: "p",
  submission: "w",
  team: "n",
  employee: "p",
  wallet: "e",
  settings: "w",
};

export default function RecentActivities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: [],
  });

  const filteredActivities = useMemo(() => {
    let filtered = [...ACTIVITIES];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.text.toLowerCase().includes(query));
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((a) => a.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((a) => a.date <= filters.dateTo);
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter((a) => filters.type.includes(a.type));
    }

    return filtered;
  }, [searchQuery, filters]);

  const toggleTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const getDotColor = (type) => {
    return DOT_COLORS[type] || "n";
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
            placeholder='Search activities...'
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
                <label>Activity type</label>
                <div className='checkbox-group'>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.type.includes("payment")}
                      onChange={() => toggleTypeFilter("payment")}
                    />
                    <span>Payments</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.type.includes("submission")}
                      onChange={() => toggleTypeFilter("submission")}
                    />
                    <span>Submissions</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.type.includes("employee")}
                      onChange={() => toggleTypeFilter("employee")}
                    />
                    <span>Employees</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.type.includes("team")}
                      onChange={() => toggleTypeFilter("team")}
                    />
                    <span>Team</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.type.includes("wallet")}
                      onChange={() => toggleTypeFilter("wallet")}
                    />
                    <span>Wallet</span>
                  </label>
                </div>
              </div>
              <button
                type='button'
                className='clear-filters'
                onClick={() =>
                  setFilters({ dateFrom: "", dateTo: "", type: [] })
                }>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='act-list'>
        {filteredActivities.length === 0 ? (
          <div className='empty-state'>No activities found</div>
        ) : (
          filteredActivities.map((act) => (
            <div key={act.id} className='act-row'>
              <div className={`dot ${getDotColor(act.type)}`} />
              <div className='act-txt'>{act.text}</div>
              <div className='act-t'>{act.time}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
