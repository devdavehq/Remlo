import { useState } from "react";
import { useToast } from "../../toast/useToast";

export default function Team() {
  const { addToast } = useToast();

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Finance");
  const [teamEditEmail, setTeamEditEmail] = useState(null);

  const [permissions, setPermissions] = useState({
    viewEmployees: true,
    editEmployees: false,
    viewPayments: true,
    createPayments: false,
    approvePayments: false,
    viewWallet: false,
    viewReports: false,
    editSettings: false,
    manageTeam: false,
  });

  const [teamRows, setTeamRows] = useState([
    {
      initials: "NA",
      name: "Ngozi Adeyemi",
      email: "ngozi@brightfuture.edu.ng",
      role: "Admin",
      tag: "You",
      pending: false,
      active: true,
      permissions: {
        viewEmployees: true,
        editEmployees: true,
        viewPayments: true,
        createPayments: true,
        approvePayments: true,
        viewWallet: true,
        viewReports: true,
        editSettings: true,
        manageTeam: true,
      },
    },
    {
      initials: "CO",
      name: "Chidi Obi",
      email: "chidi@brightfuture.edu.ng",
      role: "Finance",
      tag: "Edit",
      pending: false,
      active: true,
      permissions: {
        viewEmployees: true,
        editEmployees: false,
        viewPayments: true,
        createPayments: true,
        approvePayments: true,
        viewWallet: true,
        viewReports: false,
        editSettings: false,
        manageTeam: false,
      },
    },
  ]);

  function startTeamEdit(row) {
    setTeamEditEmail(row.email);
    setInviteName(row.name);
    setInviteEmail(row.email);
    setInviteRole(row.role);
    if (row.permissions) {
      setPermissions(row.permissions);
    }
  }

  function toggleTeamActive(email) {
    const existing = teamRows.find((r) => r.email === email);
    const nextActive = existing ? !existing.active : true;
    setTeamRows((rows) =>
      rows.map((r) => {
        if (r.email !== email) return r;
        return {
          ...r,
          pending: false,
          active: nextActive,
          tag: nextActive ? "Reactivated" : "Deactivated",
        };
      }),
    );

    if (teamEditEmail === email) setTeamEditEmail(null);

    addToast(
      nextActive ? "Team member reactivated" : "Team member deactivated",
      nextActive ? "success" : "error",
    );
  }

  function sendInvite(e) {
    e.preventDefault();
    const wasEditing = Boolean(teamEditEmail);
    const name = inviteName.trim();
    const email = inviteEmail.trim();
    if (!name || !email.includes("@")) return;
    const initials = name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    if (teamEditEmail) {
      setTeamRows((rows) =>
        rows.map((r) => {
          if (r.email !== teamEditEmail) return r;
          return {
            ...r,
            initials,
            name,
            email,
            role: inviteRole,
            permissions: { ...permissions },
            tag: "Updated",
            pending: false,
            active: true,
          };
        }),
      );
      setTeamEditEmail(null);
    } else {
      setTeamRows((rows) => [
        ...rows,
        {
          initials,
          name,
          email,
          role: inviteRole,
          permissions: { ...permissions },
          tag: "Resend",
          pending: true,
          active: true,
        },
      ]);
    }

    setInviteName("");
    setInviteEmail("");
    setPermissions({
      viewEmployees: true,
      editEmployees: false,
      viewPayments: true,
      createPayments: false,
      approvePayments: false,
      viewWallet: false,
      viewReports: false,
      editSettings: false,
      manageTeam: false,
    });

    addToast(wasEditing ? "Team member updated" : "Invite sent", "success");
  }

  return (
    <>
      <div className='sec-title'>Team members</div>
      {teamRows.map((row) => (
        <div key={row.email + row.name} className='inv-row'>
          <div className='inv-av'>{row.initials}</div>
          <div className='inv-name'>
            <strong>{row.name}</strong>
            <span>{row.email}</span>
          </div>
          <span className={`rb${row.role === "Admin" ? " rb-a" : ""}`}>
            {row.role}
          </span>
          <span
            style={{
              fontSize: 11,
              color: row.pending ? "var(--text-muted)" : "var(--accent)",
              cursor: "pointer",
            }}>
            {row.tag}
          </span>
          <div style={{ display: "flex", gap: 7, marginLeft: 6 }}>
            <button
              type='button'
              className='btn-sm-ghost'
              onClick={() => startTeamEdit(row)}
              aria-label={`Edit ${row.name}`}>
              Edit
            </button>
            <button
              type='button'
              className='btn-sm-primary'
              style={{
                background: row.active ? "var(--surface)" : "var(--accent)",
                border: row.active ? "1px solid var(--border)" : "none",
                color: row.active ? "var(--text-secondary)" : "#ffffff",
              }}
              onClick={() => toggleTeamActive(row.email)}
              aria-label={`${row.active ? "Deactivate" : "Activate"} ${row.name}`}>
              {row.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      ))}
      <div className='form-card' style={{ marginTop: 12 }}>
        <div className='fc-title'>
          {teamEditEmail ? "Edit team member" : "Invite a team member"}
        </div>
        <form onSubmit={sendInvite}>
          <div className='fg fg-2'>
            <div className='field'>
              <label htmlFor='in'>Full name</label>
              <input
                id='in'
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder='Kemi Afolabi'
              />
            </div>
            <div className='field'>
              <label htmlFor='ie'>Work email</label>
              <input
                id='ie'
                type='email'
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder='kemi@school.edu.ng'
              />
            </div>
          </div>
          <div className='field'>
            <label htmlFor='ir'>Role</label>
            <select
              id='ir'
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}>
              <option value='Finance'>Finance — approve runs</option>
              <option value='HR'>HR — manage staff</option>
              <option value='Viewer'>Viewer — read only</option>
              <option value='Admin'>Admin — full access</option>
            </select>
          </div>

          {inviteRole !== "Viewer" && inviteRole !== "Admin" && (
            <div className='permissions-section'>
              <div className='permissions-title'>Access permissions</div>
              <div className='permissions-grid'>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.viewEmployees}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        viewEmployees: e.target.checked,
                      }))
                    }
                  />
                  <span>View employees</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.editEmployees}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        editEmployees: e.target.checked,
                      }))
                    }
                  />
                  <span>Edit employees</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.viewPayments}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        viewPayments: e.target.checked,
                      }))
                    }
                  />
                  <span>View payments</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.createPayments}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        createPayments: e.target.checked,
                      }))
                    }
                  />
                  <span>Create payments</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.approvePayments}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        approvePayments: e.target.checked,
                      }))
                    }
                  />
                  <span>Approve payments</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.viewWallet}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        viewWallet: e.target.checked,
                      }))
                    }
                  />
                  <span>View wallet</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.viewReports}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        viewReports: e.target.checked,
                      }))
                    }
                  />
                  <span>View reports</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.editSettings}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        editSettings: e.target.checked,
                      }))
                    }
                  />
                  <span>Edit settings</span>
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    checked={permissions.manageTeam}
                    onChange={(e) =>
                      setPermissions((p) => ({
                        ...p,
                        manageTeam: e.target.checked,
                      }))
                    }
                  />
                  <span>Manage team</span>
                </label>
              </div>
            </div>
          )}

          {inviteRole === "Admin" && (
            <div className='info-box' style={{ marginTop: 8 }}>
              Admins have full access to all features and settings.
            </div>
          )}

          {inviteRole === "Viewer" && (
            <div className='info-box' style={{ marginTop: 8 }}>
              Viewers can only see data, not make changes.
            </div>
          )}

          {teamEditEmail ? (
            <p className='info-box' style={{ marginTop: 0 }}>
              Updating member details (demo UI).
            </p>
          ) : (
            <p className='info-box' style={{ marginTop: 0 }}>
              They get an email link (48h) — demo UI only, no mail sent.
            </p>
          )}

          {teamEditEmail && (
            <div className='btn-row' style={{ marginTop: 10 }}>
              <button
                type='button'
                className='btn-ghost'
                onClick={() => {
                  setTeamEditEmail(null);
                  setInviteName("");
                  setInviteEmail("");
                  setInviteRole("Finance");
                  setPermissions({
                    viewEmployees: true,
                    editEmployees: false,
                    viewPayments: true,
                    createPayments: false,
                    approvePayments: false,
                    viewWallet: false,
                    viewReports: false,
                    editSettings: false,
                    manageTeam: false,
                  });
                }}>
                Cancel edit
              </button>
              <button type='submit' className='tb-btn primary'>
                Save changes →
              </button>
            </div>
          )}

          {!teamEditEmail && (
            <button type='submit' className='tb-btn primary'>
              Send invite →
            </button>
          )}
        </form>
      </div>
    </>
  );
}
