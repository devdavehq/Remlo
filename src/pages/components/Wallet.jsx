import { useMemo, useState } from "react";

export default function Wallet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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
      amount: -12400000,
      type: "payment",
    },
    {
      id: 2,
      title: "Wallet funded",
      date: "Mar 20",
      amount: 5000000,
      type: "funding",
    },
    {
      id: 3,
      title: "February salary run",
      date: "Feb 26",
      amount: -11900000,
      type: "payment",
    },
    {
      id: 4,
      title: "Wallet funded",
      date: "Feb 15",
      amount: 5000000,
      type: "funding",
    },
    {
      id: 5,
      title: "January salary run",
      date: "Jan 28",
      amount: -11500000,
      type: "payment",
    },
    {
      id: 6,
      title: "Wallet funded",
      date: "Jan 10",
      amount: 5000000,
      type: "funding",
    },
  ];

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(query));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((t) => {
        const monthMap = { Jan: "01", Feb: "02", Mar: "03" };
        const txMonth = monthMap[t.date.split(" ")[0]];
        const filterMonth = filters.dateFrom.split("-")[1];
        return txMonth >= filterMonth;
      });
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => {
        const monthMap = { Jan: "01", Feb: "02", Mar: "03" };
        const txMonth = monthMap[t.date.split(" ")[0]];
        const filterMonth = filters.dateTo.split("-")[1];
        return txMonth <= filterMonth;
      });
    }
    if (filters.type.length > 0) {
      filtered = filtered.filter((t) => filters.type.includes(t.type));
    }

    return filtered;
  }, [transactions, searchQuery, filters]);

  const toggleTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

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

      <div className='sec-title'>Transactions</div>

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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search transactions...'
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
                <label>From</label>
                <input
                  type='month'
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
                <label>To</label>
                <input
                  type='month'
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                />
              </div>
              <div className='filter-group'>
                <label>Type</label>
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
                      checked={filters.type.includes("funding")}
                      onChange={() => toggleTypeFilter("funding")}
                    />
                    <span>Funding</span>
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

      <div
        className='scrollable-table-container'
        style={{ maxHeight: "400px" }}>
        <div className='tbl'>
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className='tr'
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "default",
              }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text)" }}>
                  {tx.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {tx.date}
                </div>
              </div>
              <div
                style={{
                  color: tx.amount > 0 ? "var(--positive)" : "var(--danger)",
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                {tx.amount > 0
                  ? `+₦${tx.amount.toLocaleString("en-NG")}`
                  : `−₦${Math.abs(tx.amount).toLocaleString("en-NG")}`}
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className='empty-state'>No transactions found</div>
          )}
        </div>
      </div>
    </>
  );
}
