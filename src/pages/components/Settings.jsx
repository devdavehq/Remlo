import { useMemo, useState } from "react";
import { useToast } from "../../toast/useToast";

export default function Settings({
  approvalOn,
  setApprovalOn,
  userRole = "admin",
}) {
  const { addToast } = useToast();
  const isAdmin = userRole === "admin";

  // Paystack API state
  const [paystackKey, setPaystackKey] = useState("");
  const [paystackSecret, setPaystackSecret] = useState("");
  const [showPaystackSecret, setShowPaystackSecret] = useState(false);
  const [testMode, setTestMode] = useState(true);

  // Account settings
  const [username, setUsername] = useState("ngozi@brightfuture.edu.ng");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const DEFAULT_RANKS = [
    "Junior Teacher",
    "Senior Teacher",
    "Head of Department",
    "Vice Principal",
    "Principal",
  ];
  const [ranks, setRanks] = useState(DEFAULT_RANKS);
  const [newRank, setNewRank] = useState("");

  const rankRows = useMemo(
    () =>
      ranks.map((name, i) => (
        <div key={name + i} className='rank-row'>
          <span className='drag'>⠿</span>
          <span>{name}</span>
          <span className='lv'>Level {i + 1}</span>
          <span
            className='del'
            onClick={() => setRanks((r) => r.filter((_, j) => j !== i))}>
            ×
          </span>
        </div>
      )),
    [ranks],
  );

  function addRank() {
    const v = newRank.trim();
    if (!v) return;
    setRanks((r) => [...r, v]);
    setNewRank("");
    addToast("Rank added", "success");
  }

  function handleSavePaystack() {
    addToast(
      testMode ? "Paystack test keys saved" : "Paystack live keys saved",
      "success",
    );
  }

  function handleUpdateAccount(e) {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    addToast("Account settings updated", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className='set-grid'>
      {/* Paystack API Keys - Only for admin */}
      {isAdmin && (
        <div className='set-card'>
          <div className='set-title'>Paystack Integration</div>
          <div className='tog-row'>
            <div className='tog-info'>
              <strong>Test mode</strong>
              <span>Use test keys for sandbox environment</span>
            </div>
            <label className='tog'>
              <input
                type='checkbox'
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
              />
              <span className='tog-tr' />
              <span className='tog-th' />
            </label>
          </div>
          <div className='field'>
            <label>Public Key</label>
            <input
              type='text'
              value={paystackKey}
              onChange={(e) => setPaystackKey(e.target.value)}
              placeholder={testMode ? "pk_test_..." : "pk_live_..."}
            />
          </div>
          <div className='field'>
            <label>Secret Key</label>
            <div className='password-field'>
              <input
                type={showPaystackSecret ? "text" : "password"}
                value={paystackSecret}
                onChange={(e) => setPaystackSecret(e.target.value)}
                placeholder={testMode ? "sk_test_..." : "sk_live_..."}
              />
              <button
                type='button'
                className='toggle-visibility'
                onClick={() => setShowPaystackSecret(!showPaystackSecret)}>
                {showPaystackSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type='button'
            className='tb-btn primary'
            onClick={handleSavePaystack}>
            Save Paystack Keys
          </button>
          <p className='info-box' style={{ marginTop: 8 }}>
            Paystack handles payments transparently in the background. No popups
            will appear.
          </p>
        </div>
      )}

      {/* Account Settings */}
      <div className='set-card'>
        <div className='set-title'>Account Settings</div>
        <form onSubmit={handleUpdateAccount}>
          <div className='field'>
            <label>Username / Email</label>
            <input
              type='email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='field'>
            <label>Current Password</label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder='Enter current password'
            />
          </div>
          <div className='field'>
            <label>New Password</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Leave empty to keep current'
            />
          </div>
          <div className='field'>
            <label>Confirm New Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
            />
          </div>
          <button type='submit' className='tb-btn primary'>
            Update Account
          </button>
        </form>
      </div>

      {/* Approval workflow - Only for admin */}
      {isAdmin && (
        <div className='set-card'>
          <div className='set-title'>Approval workflow</div>
          <div className='tog-row'>
            <div className='tog-info'>
              <strong>Require approval before payment</strong>
              <span>Off by default — turn on for multi-step sign-off</span>
            </div>
            <label className='tog'>
              <input
                type='checkbox'
                checked={approvalOn}
                onChange={(e) => setApprovalOn(e.target.checked)}
              />
              <span className='tog-tr' />
              <span className='tog-th' />
            </label>
          </div>
          {approvalOn && (
            <div style={{ marginTop: 12 }}>
              <div className='ap-lev'>
                <span className='lev-badge'>L1</span>
                <select>
                  <option>Chidi Obi (Finance)</option>
                  <option>Ngozi (you)</option>
                </select>
                <input placeholder='Any amount' />
              </div>
              <div className='ap-lev'>
                <span className='lev-badge'>L2</span>
                <select>
                  <option>Select…</option>
                  <option>Emeka Eze</option>
                </select>
                <input placeholder='Min ₦' />
              </div>
              <p className='info-box'>
                Level 2 optional — PayStaff-style thresholds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deductions */}
      <div className='set-card'>
        <div className='set-title'>Deductions</div>
        {["PAYE (income tax)", "Pension (PFA)", "NHF"].map((label, i) => (
          <div key={label} className='tog-row'>
            <div className='tog-info'>
              <strong>{label}</strong>
              <span>
                {i === 0
                  ? "Auto per tax bands"
                  : i === 1
                    ? "8% + 10%"
                    : "2.5% basic"}
              </span>
            </div>
            <label className='tog'>
              <input type='checkbox' defaultChecked={i < 2} />
              <span className='tog-tr' />
              <span className='tog-th' />
            </label>
          </div>
        ))}
      </div>

      {/* Rank management - Only for admin */}
      {isAdmin && (
        <div className='set-card'>
          <div className='set-title'>Rank management</div>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              marginBottom: 8,
            }}>
            From PayStaff onboarding — edit anytime.
          </p>
          <div className='rank-list-ui'>{rankRows}</div>
          <div className='add-rank'>
            <input
              value={newRank}
              onChange={(e) => setNewRank(e.target.value)}
              placeholder='Add custom rank…'
            />
            <button type='button' onClick={addRank}>
              + Add
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className='set-card'>
        <div className='set-title'>Notifications</div>
        {[
          "Run submitted",
          "Payment sent (SMS)",
          "Low wallet",
          "Failed payment",
        ].map((label) => (
          <div key={label} className='tog-row'>
            <div className='tog-info'>
              <strong>{label}</strong>
              <span>Email or SMS (demo toggles)</span>
            </div>
            <label className='tog'>
              <input type='checkbox' defaultChecked />
              <span className='tog-tr' />
              <span className='tog-th' />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
