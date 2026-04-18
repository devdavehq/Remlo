import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";

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

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.code.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query),
      );
    }

    if (filters.rank.length > 0) {
      filtered = filtered.filter((e) => filters.rank.includes(e.rank));
    }
    if (filters.department.length > 0) {
      filtered = filtered.filter((e) =>
        filters.department.includes(e.department),
      );
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter((e) =>
        filters.status.includes(e.active ? "Active" : "Inactive"),
      );
    }
    if (filters.dateHiredFrom) {
      filtered = filtered.filter((e) => e.dateHired >= filters.dateHiredFrom);
    }
    if (filters.dateHiredTo) {
      filtered = filtered.filter((e) => e.dateHired <= filters.dateHiredTo);
    }
    if (filters.salaryMin) {
      filtered = filtered.filter(
        (e) => e.netSalary >= Number(filters.salaryMin),
      );
    }
    if (filters.salaryMax) {
      filtered = filtered.filter(
        (e) => e.netSalary <= Number(filters.salaryMax),
      );
    }

    const rankLower = pill !== "all" ? pill.toLowerCase() : "";
    if (rankLower) {
      filtered = filtered.filter((e) =>
        e.rank.toLowerCase().includes(rankLower),
      );
    }

    return filtered;
  }, [employees, searchQuery, filters, pill]);

  const handleGeneralFilter = () => {
    let updatedEmployees = [...employees];

    if (generalFilterRole) {
      updatedEmployees = updatedEmployees.map((e) =>
        e.rank === generalFilterRole ? { ...e, rank: generalFilterRole } : e,
      );
    }

    if (generalFilterAmount) {
      updatedEmployees = updatedEmployees.map((e) =>
        e.rank === generalFilterRole
          ? { ...e, netSalary: Number(generalFilterAmount) }
          : e,
      );
    }

    setEmployees(updatedEmployees);
    if (externalSetEmployees) externalSetEmployees(updatedEmployees);
    addToast(
      `Updated ${updatedEmployees.filter((e) => e.rank === generalFilterRole).length} employees`,
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

  const handleEditEmployee = (emp) => {
    setEditingEmployee({ ...emp });
  };

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

  const toggleRankFilter = (rank) => {
    setFilters((prev) => ({
      ...prev,
      rank: prev.rank.includes(rank)
        ? prev.rank.filter((r) => r !== rank)
        : [...prev.rank, rank],
    }));
  };

  const toggleDepartmentFilter = (dept) => {
    setFilters((prev) => ({
      ...prev,
      department: prev.department.includes(dept)
        ? prev.department.filter((d) => d !== dept)
        : [...prev.department, dept],
    }));
  };

  const toggleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  function formatNaira(value) {
    const n = Number(value) || 0;
    return `₦${n.toLocaleString("en-NG")}`;
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, code, or email…'
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
            <div className='filter-dropdown wide'>
              <div className='filter-group'>
                <label>Rank</label>
                <div className='checkbox-group'>
                  {availableRanks.map((rank) => (
                    <label key={rank} className='checkbox-label'>
                      <input
                        type='checkbox'
                        checked={filters.rank.includes(rank)}
                        onChange={() => toggleRankFilter(rank)}
                      />
                      <span>{rank}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className='filter-group'>
                <label>Department</label>
                <div className='checkbox-group'>
                  {availableDepartments.map((dept) => (
                    <label key={dept} className='checkbox-label'>
                      <input
                        type='checkbox'
                        checked={filters.department.includes(dept)}
                        onChange={() => toggleDepartmentFilter(dept)}
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className='filter-group'>
                <label>Status</label>
                <div className='checkbox-group'>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.status.includes("Active")}
                      onChange={() => toggleStatusFilter("Active")}
                    />
                    <span>Active</span>
                  </label>
                  <label className='checkbox-label'>
                    <input
                      type='checkbox'
                      checked={filters.status.includes("Inactive")}
                      onChange={() => toggleStatusFilter("Inactive")}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>
              <div className='filter-group'>
                <label>Date hired range</label>
                <div className='date-range'>
                  <input
                    type='date'
                    placeholder='From'
                    value={filters.dateHiredFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateHiredFrom: e.target.value,
                      }))
                    }
                  />
                  <span>to</span>
                  <input
                    type='date'
                    placeholder='To'
                    value={filters.dateHiredTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateHiredTo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className='filter-group'>
                <label>Salary range (₦)</label>
                <div className='salary-range'>
                  <input
                    type='number'
                    placeholder='Min'
                    value={filters.salaryMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        salaryMin: e.target.value,
                      }))
                    }
                  />
                  <span>to</span>
                  <input
                    type='number'
                    placeholder='Max'
                    value={filters.salaryMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        salaryMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button
                type='button'
                className='clear-filters'
                onClick={() =>
                  setFilters({
                    rank: [],
                    department: [],
                    status: [],
                    dateHiredFrom: "",
                    dateHiredTo: "",
                    salaryMin: "",
                    salaryMax: "",
                  })
                }>
                Clear all
              </button>
            </div>
          )}
        </div>
        <div className='action-buttons-group'>
          <button
            type='button'
            className={`pill${pill === "all" ? " on" : ""}`}
            onClick={() => setPill("all")}>
            All
          </button>
          <button
            type='button'
            className={`pill${pill === "junior" ? " on" : ""}`}
            onClick={() => setPill("junior")}>
            Junior
          </button>
          <button
            type='button'
            className={`pill${pill === "senior" ? " on" : ""}`}
            onClick={() => setPill("senior")}>
            Senior
          </button>
          <button
            type='button'
            className='tb-btn primary'
            onClick={() => go("add-emp")}>
            + Add
          </button>
          <button
            type='button'
            className='tb-btn'
            onClick={() => setShowGeneralFilter(true)}>
            General Filter
          </button>
        </div>
      </div>

      {showGeneralFilter && (
        <div
          className='modal-overlay'
          onClick={() => setShowGeneralFilter(false)}>
          <div
            className='modal-content small'
            onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>General Filter</h3>
              <button
                className='modal-close'
                onClick={() => setShowGeneralFilter(false)}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='field'>
                <label>Filter by role</label>
                <select
                  value={generalFilterRole}
                  onChange={(e) => setGeneralFilterRole(e.target.value)}>
                  <option value=''>Select role...</option>
                  {availableRanks.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </div>
              <div className='field'>
                <label>Update salary to (₦)</label>
                <input
                  type='number'
                  value={generalFilterAmount}
                  onChange={(e) => setGeneralFilterAmount(e.target.value)}
                  placeholder='Leave empty to keep current'
                />
              </div>
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
                  Apply to all{" "}
                  {generalFilterRole
                    ? employees.filter((e) => e.rank === generalFilterRole)
                        .length
                    : 0}{" "}
                  employees
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingEmployee && (
        <div className='modal-overlay' onClick={() => setEditingEmployee(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Edit Employee</h3>
              <button
                className='modal-close'
                onClick={() => setEditingEmployee(null)}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='fg fg-2'>
                <div className='field'>
                  <label>Name</label>
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
                  <label>Code</label>
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
              </div>
              <div className='fg fg-2'>
                <div className='field'>
                  <label>Rank</label>
                  <select
                    value={editingEmployee.rank}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        rank: e.target.value,
                      })
                    }>
                    <option>Junior Teacher</option>
                    <option>Senior Teacher</option>
                    <option>HOD</option>
                  </select>
                </div>
                <div className='field'>
                  <label>Department</label>
                  <input
                    value={editingEmployee.department}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='fg fg-2'>
                <div className='field'>
                  <label>Email</label>
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
                  <label>Phone</label>
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
              <div className='fg fg-2'>
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
                <div className='field'>
                  <label>Gross salary</label>
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

      <div className='scrollable-table-container'>
        <div className='tbl emp-cols'>
          <div className='th emp-cols'>
            <span>Employee</span>
            <span>Code</span>
            <span>Rank</span>
            <span>Department</span>
            <span>Net salary</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className='tr emp-cols'>
              <span className='emp-name-cell'>{emp.name}</span>
              <span>{emp.code}</span>
              <span>
                <span className='rtag'>{emp.rank}</span>
              </span>
              <span>{emp.department}</span>
              <span>{formatNaira(emp.netSalary)}</span>
              <span>
                <span className={`sb${emp.active ? " sb-ok" : " sb-rej"}`}>
                  {emp.active ? "Active" : "Inactive"}
                </span>
              </span>
              <span className='action-buttons'>
                <button
                  type='button'
                  className='edit-btn'
                  onClick={() => handleEditEmployee(emp)}>
                  Edit
                </button>
                <button
                  type='button'
                  className='delete-btn'
                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}>
                  Delete
                </button>
                <button
                  type='button'
                  className='view-btn'
                  onClick={() => {
                    setempid(emp.id);
                    go("emp-detail");
                  }}>
                  View
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
