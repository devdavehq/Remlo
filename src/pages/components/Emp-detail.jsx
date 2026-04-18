import { useMemo } from "react";
import { useToast } from "../../toast/useToast";


export default function Empdetail({ selectedEmployeeId, employees, setEmployees }) {



  const { addToast } = useToast()
  
    function formatNaira(value) {
      const n = Number(value) || 0;
      return `₦${n.toLocaleString("en-NG")}`;
    }

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [employees, selectedEmployeeId]);

  return (
    <>
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
          <button type='button' className='tb-btn'>
            Edit
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
      <div className='ed-grid'>
        <div className='ed-card'>
          <div className='ed-title'>Personal</div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Email</span>
            <span>
              {selectedEmployee.name.replace(/\s+/g, ".").toLowerCase()}
              @school.edu.ng
            </span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Status</span>
            <span
              style={{
                color: selectedEmployee.active
                  ? "var(--positive)"
                  : "var(--danger)",
                fontWeight: 600,
              }}>
              {selectedEmployee.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className='ed-card'>
          <div className='ed-title'>Compensation</div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Gross</span>
            <span>{formatNaira(selectedEmployee.netSalary)}</span>
          </div>
          <div className='ed-row'>
            <span style={{ color: "var(--text-secondary)" }}>Net pay</span>
            <span style={{ color: "var(--positive)", fontWeight: 600 }}>
              {formatNaira(selectedEmployee.netSalary)}
            </span>
          </div>
        </div>
      </div>
      <div className='sec-title' style={{ marginTop: 14 }}>
        Payment history
      </div>
      <div className='tbl'>
        <div
          className='ph-row'
          style={{
            fontWeight: 600,
            color: "var(--text-secondary)",
            fontSize: 11,
          }}>
          <span>Period</span>
          <span>Gross</span>
          <span>Net paid</span>
          <span>Status</span>
        </div>
        <div className='ph-row'>
          <span>March 2025</span>
          <span>₦300,000</span>
          <span>₦253,500</span>
          <span className='sb sb-ok'>Sent</span>
        </div>
        <div className='ph-row'>
          <span>February 2025</span>
          <span>₦300,000</span>
          <span>₦253,500</span>
          <span className='sb sb-ok'>Sent</span>
        </div>
      </div>
    </>
  );
}