import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";
import { IconEdit, IconDelete, IconChevronRight } from "../../icons/icons";

// Custom Select component with 2026-style styling
function CustomSelect({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;

  return (
    <div className='csel-wrap' style={{ position: "relative" }}>
      <button
        type='button'
        className='csel-trigger'
        onClick={() => setOpen((p) => !p)}
        aria-haspopup='listbox'
        aria-expanded={open}>
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
                  role='option'
                  aria-selected={isSelected}
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

const PAGE_SIZE = 10;

export default function Employee({
  go,
  setempid,
  employees: externalEmployees,
  setEmployees: externalSetEmployees,
}) {
  const [pill, setPill] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGeneralFilter, setShowGeneralFilter] = useState(false);
  const [generalFilterRole, setGeneralFilterRole] = useState("");
  const [generalFilterAmount, setGeneralFilterAmount] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [page, setPage] = useState(1);

  const [employees, setEmployees] = useState(
    externalEmployees || [
      {
        id: "emp-1",
        code: "EMP-010",
        name: "Amaka Osei",
        rank: "HOD",
        department: "Sciences",
        netSalary: 296000,
        active: true,
        email: "amaka@school.edu.ng",
        phone: "+234 801 234 5678",
        dateHired: "2023-01-15",
      },
      {
        id: "emp-2",
        code: "EMP-011",
        name: "Bisi Adeyemi",
        rank: "Senior Teacher",
        department: "English",
        netSalary: 212000,
        active: true,
        email: "bisi@school.edu.ng",
        phone: "+234 802 345 6789",
        dateHired: "2023-02-20",
      },
      {
        id: "emp-3",
        code: "EMP-012",
        name: "Chuks Nwosu",
        rank: "Junior Teacher",
        department: "Maths",
        netSalary: 128400,
        active: true,
        email: "chuks@school.edu.ng",
        phone: "+234 803 456 7890",
        dateHired: "2023-03-10",
      },
      {
        id: "emp-4",
        code: "EMP-013",
        name: "Folake Williams",
        rank: "Senior Teacher",
        department: "Sciences",
        netSalary: 212000,
        active: true,
        email: "folake@school.edu.ng",
        phone: "+234 804 567 8901",
        dateHired: "2023-04-05",
      },
      {
        id: "emp-5",
        code: "EMP-014",
        name: "Godwin Okonkwo",
        rank: "Junior Teacher",
        department: "English",
        netSalary: 128400,
        active: false,
        email: "godwin@school.edu.ng",
        phone: "+234 805 678 9012",
        dateHired: "2023-05-12",
      },
      {
        id: "emp-6",
        code: "EMP-015",
        name: "Halima Musa",
        rank: "HOD",
        department: "Maths",
        netSalary: 296000,
        active: true,
        email: "halima@school.edu.ng",
        phone: "+234 806 789 0123",
        dateHired: "2022-09-01",
      },
      {
        id: "emp-7",
        code: "EMP-016",
        name: "Ikenna Eze",
        rank: "Senior Teacher",
        department: "Sciences",
        netSalary: 212000,
        active: true,
        email: "ikenna@school.edu.ng",
        phone: "+234 807 890 1234",
        dateHired: "2022-10-15",
      },
      {
        id: "emp-8",
        code: "EMP-017",
        name: "Joke Adesanya",
        rank: "Junior Teacher",
        department: "Social Studies",
        netSalary: 128400,
        active: true,
        email: "joke@school.edu.ng",
        phone: "+234 808 901 2345",
        dateHired: "2023-06-01",
      },
    ],
  );

  const { addToast } = useToast();

  const [filters, setFilters] = useState({
    rank: [],
    department: [],
    status: [],
    dateHiredFrom: "",
    dateHiredTo: "",
    salaryMin: "",
    salaryMax: "",
  });

  const availableRanks = useMemo(
    () => Array.from(new Set(employees.map((e) => e.rank))),
    [employees],
  );
  const availableDepartments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))),
    [employees],
  );

  const hasActiveFilters =
    filters.rank.length > 0 ||
    filters.department.length > 0 ||
    filters.status.length > 0 ||
    filters.dateHiredFrom ||
    filters.dateHiredTo ||
    filters.salaryMin ||
    filters.salaryMax;

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q),
      );
    }
    if (filters.rank.length > 0)
      filtered = filtered.filter((e) => filters.rank.includes(e.rank));
    if (filters.department.length > 0)
      filtered = filtered.filter((e) =>
        filters.department.includes(e.department),
      );
    if (filters.status.length > 0)
      filtered = filtered.filter((e) =>
        filters.status.includes(e.active ? "Active" : "Inactive"),
      );
    if (filters.dateHiredFrom)
      filtered = filtered.filter((e) => e.dateHired >= filters.dateHiredFrom);
    if (filters.dateHiredTo)
      filtered = filtered.filter((e) => e.dateHired <= filters.dateHiredTo);
    if (filters.salaryMin)
      filtered = filtered.filter(
        (e) => e.netSalary >= Number(filters.salaryMin),
      );
    if (filters.salaryMax)
      filtered = filtered.filter(
        (e) => e.netSalary <= Number(filters.salaryMax),
      );
    if (pill !== "all")
      filtered = filtered.filter((e) =>
        e.rank.toLowerCase().includes(pill.toLowerCase()),
      );
    return filtered;
  }, [employees, searchQuery, filters, pill]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageEmployees = filteredEmployees.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleGeneralFilter = () => {
    let updated = [...employees];
    if (generalFilterAmount) {
      updated = updated.map((e) =>
        e.rank === generalFilterRole
          ? { ...e, netSalary: Number(generalFilterAmount) }
          : e,
      );
    }
    setEmployees(updated);
    if (externalSetEmployees) externalSetEmployees(updated);
    addToast(
      `Updated ${updated.filter((e) => e.rank === generalFilterRole).length} employees`,
      "success",
    );
    setShowGeneralFilter(false);
    setGeneralFilterRole("");
    setGeneralFilterAmount("");
  };

  const handleDeleteEmployee = (empId, empName) => {
    if (window.confirm(`Are you sure you want to delete ${empName}?`)) {
      const updated = employees.filter((e) => e.id !== empId);
      setEmployees(updated);
      if (externalSetEmployees) externalSetEmployees(updated);
      addToast(`${empName} deleted`, "success");
    }
  };

  const handleEditEmployee = (emp) => setEditingEmployee({ ...emp });

  const saveEditEmployee = () => {
    if (editingEmployee) {
      const updated = employees.map((e) =>
        e.id === editingEmployee.id ? editingEmployee : e,
      );
      setEmployees(updated);
      if (externalSetEmployees) externalSetEmployees(updated);
      addToast(`${editingEmployee.name} updated`, "success");
      setEditingEmployee(null);
    }
  };

  const toggleFilter = (key, val) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter((v) => v !== val)
        : [...prev[key], val],
    }));
    setPage(1);
  };

  function formatNaira(v) {
    return `₦${(Number(v) || 0).toLocaleString("en-NG")}`;
  }

  const rankOptions = [
    {
      value: "Junior Teacher",
      label: "Junior Teacher",
      description: "Entry level teaching staff",
    },
    {
      value: "Senior Teacher",
      label: "Senior Teacher",
      description: "Experienced classroom teachers",
    },
    { value: "HOD", label: "HOD", description: "Head of Department" },
    {
      value: "Vice Principal",
      label: "Vice Principal",
      description: "School administration",
    },
    { value: "Principal", label: "Principal", description: "School head" },
  ];

  const departmentOptions = [
    { value: "Sciences", label: "Sciences" },
    { value: "English", label: "English" },
    { value: "Maths", label: "Maths" },
    { value: "Social Studies", label: "Social Studies" },
    { value: "Arts", label: "Arts" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "ICT", label: "ICT" },
    { value: "Administration", label: "Administration" },
  ];

  return (
    <>
      {/* Search + Filter Bar */}
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
            placeholder='Search employees...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Pill filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", "Junior Teacher", "Senior Teacher", "HOD"].map((p) => (
            <button
              key={p}
              type='button'
              className={`pill${pill === p ? " on" : ""}`}
              onClick={() => {
                setPill(p);
                setPage(1);
              }}>
              {p === "all" ? "All ranks" : p}
            </button>
          ))}
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
                {[
                  filters.rank.length,
                  filters.department.length,
                  filters.status.length,
                ]
                  .filter(Boolean)
                  .reduce((a, b) => a + b, 0) +
                  (filters.salaryMin ? 1 : 0) +
                  (filters.salaryMax ? 1 : 0) +
                  (filters.dateHiredFrom ? 1 : 0) +
                  (filters.dateHiredTo ? 1 : 0)}
              </span>
            )}
          </button>

          {showFilter && (
            <div className='filter-dropdown wide' style={{ minWidth: 320 }}>
              <div className='filter-dropdown-header'>
                <span className='filter-dropdown-title'>Filter employees</span>
                <button
                  type='button'
                  className='filter-clear-link'
                  onClick={() => {
                    setFilters({
                      rank: [],
                      department: [],
                      status: [],
                      dateHiredFrom: "",
                      dateHiredTo: "",
                      salaryMin: "",
                      salaryMax: "",
                    });
                    setPage(1);
                  }}>
                  Clear all
                </button>
              </div>

              <div className='filter-section'>
                <div className='filter-section-label'>Rank</div>
                <div className='filter-chip-group'>
                  {availableRanks.map((r) => (
                    <button
                      key={r}
                      type='button'
                      className={`filter-chip${filters.rank.includes(r) ? " on" : ""}`}
                      onClick={() => toggleFilter("rank", r)}>
                      {filters.rank.includes(r) && (
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
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className='filter-section'>
                <div className='filter-section-label'>Department</div>
                <div className='filter-chip-group'>
                  {availableDepartments.map((d) => (
                    <button
                      key={d}
                      type='button'
                      className={`filter-chip${filters.department.includes(d) ? " on" : ""}`}
                      onClick={() => toggleFilter("department", d)}>
                      {filters.department.includes(d) && (
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
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className='filter-section'>
                <div className='filter-section-label'>Status</div>
                <div className='filter-chip-group'>
                  {["Active", "Inactive"].map((s) => (
                    <button
                      key={s}
                      type='button'
                      className={`filter-chip${filters.status.includes(s) ? " on" : ""}`}
                      onClick={() => toggleFilter("status", s)}>
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

              <div className='filter-section'>
                <div className='filter-section-label'>Salary range (₦)</div>
                <div className='filter-range-row'>
                  <input
                    type='number'
                    placeholder='Min'
                    value={filters.salaryMin}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, salaryMin: e.target.value }))
                    }
                    className='filter-range-input'
                  />
                  <span className='filter-range-sep'>—</span>
                  <input
                    type='number'
                    placeholder='Max'
                    value={filters.salaryMax}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, salaryMax: e.target.value }))
                    }
                    className='filter-range-input'
                  />
                </div>
              </div>

              <div className='filter-section' style={{ marginBottom: 0 }}>
                <div className='filter-section-label'>Date hired</div>
                <div className='filter-range-row'>
                  <input
                    type='date'
                    value={filters.dateHiredFrom}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        dateHiredFrom: e.target.value,
                      }))
                    }
                    className='filter-range-input'
                  />
                  <span className='filter-range-sep'>—</span>
                  <input
                    type='date'
                    value={filters.dateHiredTo}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, dateHiredTo: e.target.value }))
                    }
                    className='filter-range-input'
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type='button'
          className='tb-btn'
          onClick={() => setShowGeneralFilter(true)}>
          Bulk update
        </button>
      </div>

      {/* Datatable */}
      <div className='datatable-wrap'>
        <div className='tbl'>
          <div className='th emp-cols'>
            <span>Employee</span>
            <span>Code</span>
            <span>Rank</span>
            <span>Department</span>
            <span>Net salary</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {pageEmployees.length === 0 ? (
            <div className='empty-state'>No employees found</div>
          ) : (
            pageEmployees.map((emp) => (
              <div key={emp.id} className='tr emp-cols'>
                <span className='emp-name-cell'>{emp.name}</span>
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}>
                  {emp.code}
                </span>
                <span>
                  <span className='rtag'>{emp.rank}</span>
                </span>
                <span>{emp.department}</span>
                <span style={{ fontWeight: 500 }}>
                  {formatNaira(emp.netSalary)}
                </span>
                <span>
                  <span className={`sb${emp.active ? " sb-ok" : " sb-rej"}`}>
                    {emp.active ? "Active" : "Inactive"}
                  </span>
                </span>
                <span className='action-buttons'>
                  <button
                    type='button'
                    className='icon-action-btn edit'
                    title='Edit employee'
                    onClick={() => handleEditEmployee(emp)}>
                    <IconEdit />
                  </button>
                  <button
                    type='button'
                    className='icon-action-btn delete'
                    title='Delete employee'
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}>
                    <IconDelete />
                  </button>
                  <button
                    type='button'
                    className='icon-action-btn view'
                    title='View details'
                    onClick={() => {
                      setempid(emp.id);
                      go("emp-detail");
                    }}>
                    <IconChevronRight />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className='datatable-footer'>
          <span className='datatable-info'>
            {filteredEmployees.length === 0
              ? "No results"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredEmployees.length)} of ${filteredEmployees.length}`}
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

      {/* Bulk Update Modal */}
      {showGeneralFilter && (
        <div
          className='modal-overlay'
          onClick={() => setShowGeneralFilter(false)}>
          <div
            className='modal-content'
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 480 }}>
            <div className='modal-header'>
              <h3>Bulk salary update</h3>
              <button
                className='modal-close'
                onClick={() => setShowGeneralFilter(false)}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                  marginTop: 0,
                }}>
                Update the salary for all employees of a specific rank at once.
              </p>
              <div className='field'>
                <label>Select rank</label>
                <CustomSelect
                  value={generalFilterRole}
                  onChange={setGeneralFilterRole}
                  placeholder='Choose a rank...'
                  options={rankOptions}
                />
              </div>
              <div className='field'>
                <label>New salary amount (₦)</label>
                <input
                  type='number'
                  value={generalFilterAmount}
                  onChange={(e) => setGeneralFilterAmount(e.target.value)}
                  placeholder='Leave empty to keep current'
                />
              </div>
              {generalFilterRole && (
                <div className='info-box' style={{ margin: "12px 0 0" }}>
                  This will update{" "}
                  <strong>
                    {
                      employees.filter((e) => e.rank === generalFilterRole)
                        .length
                    }
                  </strong>{" "}
                  employee(s) with rank <strong>{generalFilterRole}</strong>.
                </div>
              )}
              <div className='modal-actions'>
                <button
                  type='button'
                  className='tb-btn'
                  onClick={() => setShowGeneralFilter(false)}>
                  Cancel
                </button>
                <button
                  type='button'
                  className='tb-btn primary'
                  onClick={handleGeneralFilter}
                  disabled={!generalFilterRole}>
                  Apply update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal - wider */}
      {editingEmployee && (
        <div className='modal-overlay' onClick={() => setEditingEmployee(null)}>
          <div
            className='modal-content wide-modal'
            onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <div>
                <h3 style={{ margin: 0 }}>Edit Employee</h3>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}>
                  {editingEmployee.code}
                </div>
              </div>
              <button
                className='modal-close'
                onClick={() => setEditingEmployee(null)}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='fg fg-3'>
                <div className='field'>
                  <label>Full name</label>
                  <input
                    value={editingEmployee.name}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='field'>
                  <label>Employee code</label>
                  <input
                    value={editingEmployee.code}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='field'>
                  <label>Date hired</label>
                  <input
                    type='date'
                    value={editingEmployee.dateHired}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        dateHired: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='fg fg-2'>
                <div className='field'>
                  <label>Rank</label>
                  <CustomSelect
                    value={editingEmployee.rank}
                    onChange={(v) =>
                      setEditingEmployee({ ...editingEmployee, rank: v })
                    }
                    options={rankOptions}
                  />
                </div>
                <div className='field'>
                  <label>Department</label>
                  <CustomSelect
                    value={editingEmployee.department}
                    onChange={(v) =>
                      setEditingEmployee({ ...editingEmployee, department: v })
                    }
                    options={departmentOptions}
                  />
                </div>
              </div>
              <div className='fg fg-2'>
                <div className='field'>
                  <label>Email address</label>
                  <input
                    value={editingEmployee.email}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='field'>
                  <label>Phone number</label>
                  <input
                    value={editingEmployee.phone}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='field' style={{ maxWidth: 240 }}>
                <label>Gross salary (₦)</label>
                <input
                  type='number'
                  value={editingEmployee.netSalary}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      netSalary: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className='modal-actions'>
                <button
                  type='button'
                  className='tb-btn'
                  onClick={() => setEditingEmployee(null)}>
                  Cancel
                </button>
                <button
                  type='button'
                  className='tb-btn primary'
                  onClick={saveEditEmployee}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
