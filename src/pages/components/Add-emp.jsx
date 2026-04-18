import { useState, useRef } from "react";
import { useToast } from "../../toast/useToast";

export default function AddEmp({
  setEmployees,
  setSelectedEmployeeId,
  go,
  employees,
}) {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);

  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkError, setBulkError] = useState("");
  const [bulkFileName, setBulkFileName] = useState("");

  const [addEmpForm, setAddEmpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rank: "Junior Teacher",
    department: "",
    dateHired: "",
    grossSalary: "",
    employeeCode: "",
    bank: "GTBank",
    accountNumber: "",
    verifiedName: "",
    nin: "",
    active: true,
  });

  const parseBool = (value) => {
    if (value === null || value === undefined) return false;
    const v = String(value).trim().toLowerCase();
    if (!v) return false;
    return v === "1" || v === "true" || v === "yes" || v === "active";
  };

  function parseCsvLine(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  }

  function parseCsvText(text) {
    const lines = String(text)
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.every((c) => !c)) continue;

      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] ?? "";
      });
      rows.push(obj);
    }

    return rows;
  }

  function handleDrop(e) {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }

  function processFile(file) {
    setBulkError("");
    setBulkPreview([]);
    setBulkFileName(file.name);

    const lower = file.name.toLowerCase();
    const isCsv =
      lower.endsWith(".csv") || file.type.toLowerCase().includes("csv");

    if (!isCsv) {
      setBulkError(
        "Excel import is not enabled yet. For now, please use CSV files.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = parseCsvText(text);
        const normalized = parsed
          .map((row, idx) => normalizeEmployeeFromRow(row, idx))
          .filter(Boolean);

        if (normalized.length === 0) {
          setBulkError(
            "No valid employees found. Check your CSV headers and required columns.",
          );
        } else {
          setBulkError("");
        }
        setBulkPreview(normalized);
      } catch {
        setBulkError(
          "Failed to parse CSV. Make sure it is comma-separated with headers.",
        );
      }
    };
    reader.onerror = () => {
      setBulkError("Failed to read file.");
    };

    reader.readAsText(file);
  }

  function normalizeEmployeeFromRow(row, index) {
    const get = (keys) => {
      for (const k of keys) {
        if (
          row[k] !== undefined &&
          row[k] !== null &&
          String(row[k]).trim() !== ""
        )
          return String(row[k]).trim();
      }
      return "";
    };

    const firstName = get(["firstname", "first_name"]);
    const lastName = get(["lastname", "last_name"]);
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      get(["name", "fullname", "full_name"]);

    const rank = get(["rank", "title", "role", "tier"]);
    const department = get(["department", "dept"]);
    const grossSalaryRaw = get([
      "grosssalary",
      "gross_salary",
      "gros_salary",
      "gross",
      "salary",
      "netsalary",
      "net_salary",
    ]);
    const netSalary = grossSalaryRaw ? Number(grossSalaryRaw) : 0;

    const employeeCode = get([
      "employeecode",
      "employee_code",
      "code",
      "empcode",
      "emp_code",
    ]);
    const bank = get(["bank"]);
    const accountNumber = get([
      "accountnumber",
      "account_number",
      "acct",
      "acct_number",
    ]);
    const email = get(["email", "workemail", "work_email"]);
    const phone = get(["phone", "tel", "telephone"]);
    const dateHired = get(["datehired", "date_hired"]);
    const nin = get(["nin", "tin", "tax_id"]);

    const activeRaw = get(["active", "isactive", "is_active"]);
    const active = activeRaw === "" ? true : parseBool(activeRaw);

    if (!fullName || !rank || !department) return null;

    const code =
      employeeCode || `EMP-${String(index + 1).padStart(3, "0")}-${index}`;

    return {
      id: `emp-bulk-${index}`,
      code,
      name: fullName,
      rank,
      department,
      netSalary: Number.isFinite(netSalary) ? netSalary : 0,
      active,
      email,
      phone,
      dateHired,
      bank: bank || "GTBank",
      accountNumber,
      nin: nin || "",
      verifiedName: "Auto-verified",
      grossSalary: Number.isFinite(netSalary) ? netSalary : 0,
    };
  }

  function handleBulkFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    processFile(file);
  }

  function importBulkEmployees() {
    if (bulkPreview.length === 0) return;

    setEmployees((prev) => {
      const byCode = new Map(prev.map((x) => [x.code, x]));
      for (const emp of bulkPreview) {
        const existing = byCode.get(emp.code);
        if (existing) {
          byCode.set(emp.code, { ...existing, ...emp, id: existing.id });
        } else {
          byCode.set(emp.code, emp);
        }
      }
      return Array.from(byCode.values());
    });

    const first = bulkPreview[0];
    if (first) setSelectedEmployeeId(first.id);

    addToast(`Imported ${bulkPreview.length} employees`, "success");
    setBulkPreview([]);
    setBulkFileName("");
    setBulkError("");
    go("employees");
  }

  function saveSingleEmployee() {
    const firstName = addEmpForm.firstName.trim();
    const lastName = addEmpForm.lastName.trim();
    const department = addEmpForm.department.trim();
    const rank = addEmpForm.rank;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    const grossSalary = Number(addEmpForm.grossSalary);
    const netSalary = Number.isFinite(grossSalary) ? grossSalary : 0;

    if (!fullName || !rank || !department) {
      addToast(
        "Please fill First name, Last name, Rank, and Department.",
        "error",
      );
      return;
    }

    const nextIndex = employees.length + 1;
    const code =
      addEmpForm.employeeCode.trim() ||
      `EMP-${String(nextIndex).padStart(3, "0")}`;

    const newEmp = {
      id: `emp-${nextIndex}`,
      code,
      name: fullName,
      rank,
      department,
      netSalary,
      active: addEmpForm.active,
      email: addEmpForm.email.trim(),
      phone: addEmpForm.phone.trim(),
      dateHired: addEmpForm.dateHired,
      bank: addEmpForm.bank,
      accountNumber: addEmpForm.accountNumber,
      nin: addEmpForm.nin.trim(),
      verifiedName: addEmpForm.verifiedName || "Auto-verified",
      grossSalary: netSalary,
    };

    setEmployees((prev) => {
      const byCode = new Map(prev.map((x) => [x.code, x]));
      const existing = byCode.get(newEmp.code);
      if (existing)
        byCode.set(newEmp.code, { ...existing, ...newEmp, id: existing.id });
      else byCode.set(newEmp.code, newEmp);
      return Array.from(byCode.values());
    });

    setSelectedEmployeeId(newEmp.id);
    addToast("Employee saved", "success");

    setAddEmpForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rank: "Junior Teacher",
      department: "",
      dateHired: "",
      grossSalary: "",
      employeeCode: "",
      bank: "GTBank",
      accountNumber: "",
      verifiedName: "",
      nin: "",
      active: true,
    });

    go("employees");
  }

  return (
    <>
      <div className='form-card'>
        <div className='fc-title'>Bulk upload (CSV)</div>
        <div
          className={`csv-zone ${isDragging ? "dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleDrop(e);
          }}
          onClick={() => fileInputRef.current?.click()}>
          <svg
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'>
            <path
              d='M12 16V4M8 8l4-4 4 4'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2'
              strokeLinecap='round'
            />
          </svg>
          <div className='csv-zone-text'>
            <strong>Drop your CSV file here</strong>
            <span>or click to browse</span>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='.csv'
            onChange={handleBulkFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className='csv-format-hint'>
          <button
            type='button'
            className='view-format-btn'
            onClick={() => setShowFormatModal(true)}>
            <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path
                d='M7 4.5V7M7 9.5H7.01M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
              />
            </svg>
            View CSV format
          </button>
        </div>

        {bulkFileName && (
          <div className='uploaded-file'>
            File: <strong>{bulkFileName}</strong>
          </div>
        )}
        {bulkError && <div className='info-box error'>{bulkError}</div>}

        {bulkPreview.length > 0 && (
          <>
            <div className='sec-title'>Preview ({bulkPreview.length})</div>
            <div className='preview-scroll'>
              {bulkPreview.slice(0, 6).map((emp) => (
                <div key={emp.id} className='inv-row'>
                  <div className='inv-av'>
                    {emp.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className='inv-name'>
                    <strong>{emp.name}</strong>
                    <span>
                      {emp.rank} · {emp.department}
                    </span>
                  </div>
                  <span className={`sb ${emp.active ? "sb-ok" : "sb-rej"}`}>
                    {emp.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type='button'
          className='tb-btn primary'
          onClick={importBulkEmployees}
          disabled={bulkPreview.length === 0}>
          Import to employees →
        </button>
      </div>

      {showFormatModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowFormatModal(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>CSV Format Guide</h3>
              <button
                className='modal-close'
                onClick={() => setShowFormatModal(false)}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <p>
                Your CSV should include any of these column names
                (case-insensitive):
              </p>
              <div className='format-grid'>
                <div>
                  <strong>Required:</strong>
                </div>
                <div>
                  firstname / first_name, lastname / last_name, rank, department
                </div>
                <div>
                  <strong>Optional:</strong>
                </div>
                <div>
                  email, phone, grosssalary / gross_salary, employeecode /
                  employee_code, bank, accountnumber, datehired / date_hired,
                  active, nin / tin
                </div>
              </div>
              <div className='format-example'>
                <strong>Example row:</strong>
                <code>
                  firstname,lastname,rank,department,grossSalary,email,active,nin
                </code>
                <code>
                  Funke,Adeleke,Senior
                  Teacher,Sciences,250000,funke@school.edu.ng,true,12345678901
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='form-card'>
        <div className='fc-title'>Personal information</div>
        <div className='fg fg-2'>
          <div className='field'>
            <label>First name</label>
            <input
              value={addEmpForm.firstName}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  firstName: e.target.value,
                }))
              }
              placeholder='Funke'
            />
          </div>
          <div className='field'>
            <label>Last name</label>
            <input
              value={addEmpForm.lastName}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  lastName: e.target.value,
                }))
              }
              placeholder='Adeleke'
            />
          </div>
        </div>
        <div className='fg fg-2'>
          <div className='field'>
            <label>Email (optional)</label>
            <input
              value={addEmpForm.email}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  email: e.target.value,
                }))
              }
              type='email'
              placeholder='funke@school.edu.ng'
            />
          </div>
          <div className='field'>
            <label>Phone</label>
            <input
              value={addEmpForm.phone}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  phone: e.target.value,
                }))
              }
              placeholder='+234 …'
            />
          </div>
        </div>
        <div className='fg fg-3'>
          <div className='field'>
            <label>Rank</label>
            <select
              value={addEmpForm.rank}
              onChange={(e) =>
                setAddEmpForm((s) => ({ ...s, rank: e.target.value }))
              }>
              <option>Junior Teacher</option>
              <option>Senior Teacher</option>
              <option>HOD</option>
            </select>
          </div>
          <div className='field'>
            <label>Department</label>
            <input
              value={addEmpForm.department}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  department: e.target.value,
                }))
              }
              placeholder='Sciences'
            />
          </div>
          <div className='field'>
            <label>Date hired</label>
            <input
              type='date'
              value={addEmpForm.dateHired}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  dateHired: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className='tog-row' style={{ marginTop: 10 }}>
          <div className='tog-info'>
            <strong>Active</strong>
            <span>Inactive employees won't appear in payment runs.</span>
          </div>
          <label className='tog'>
            <input
              type='checkbox'
              checked={addEmpForm.active}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  active: e.target.checked,
                }))
              }
            />
            <span className='tog-tr' />
            <span className='tog-th' />
          </label>
        </div>
      </div>

      <div className='form-card'>
        <div className='fc-title'>Bank & salary</div>
        <div className='fg fg-2'>
          <div className='field'>
            <label>Gross salary (₦)</label>
            <input
              type='number'
              value={addEmpForm.grossSalary}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  grossSalary: e.target.value,
                }))
              }
              placeholder='250000'
            />
          </div>
          <div className='field'>
            <label>Employee code</label>
            <input
              value={addEmpForm.employeeCode}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  employeeCode: e.target.value,
                }))
              }
              placeholder='Auto (EMP-064)'
            />
          </div>
        </div>
        <div className='fg fg-3'>
          <div className='field'>
            <label>Bank</label>
            <select
              value={addEmpForm.bank}
              onChange={(e) =>
                setAddEmpForm((s) => ({ ...s, bank: e.target.value }))
              }>
              <option>GTBank</option>
              <option>Zenith</option>
              <option>UBA</option>
            </select>
          </div>
          <div className='field'>
            <label>Account number</label>
            <input
              value={addEmpForm.accountNumber}
              onChange={(e) =>
                setAddEmpForm((s) => ({
                  ...s,
                  accountNumber: e.target.value,
                }))
              }
              placeholder='10 digits'
              maxLength={10}
            />
          </div>
          <div className='field'>
            <label>NIN / TIN (optional)</label>
            <input
              value={addEmpForm.nin}
              onChange={(e) =>
                setAddEmpForm((s) => ({ ...s, nin: e.target.value }))
              }
              placeholder='National ID / Tax ID'
            />
          </div>
        </div>
        <div className='fg fg-3'>
          <div className='field'>
            <label>Verified name</label>
            <input
              readOnly
              value={addEmpForm.verifiedName || "Auto-verified"}
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            marginTop: 8,
          }}>
          NUBAN + Paystack name check would run when a backend exists.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type='button'
          className='tb-btn'
          onClick={() => go("employees")}>
          Cancel
        </button>
        <button
          type='button'
          className='tb-btn primary'
          onClick={saveSingleEmployee}>
          Save employee
        </button>
      </div>
    </>
  );
}
