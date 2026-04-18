import { useToast } from "../../toast/useToast";

export default function Approvals() {
  const { addToast } = useToast();

  return (
    <>
      <div className='ap-card'>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
          March 2025 — Bonus run · #012
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}>
          Uploaded by Ngozi · Today · 18 employees · ₦1,800,000
        </p>
        <div className='bdr'>
          <span>Senior teachers (10 × ₦60,000)</span>
          <span>₦600,000</span>
        </div>
        <div className='bdr'>
          <span>HODs (8 × ₦150,000)</span>
          <span>₦1,200,000</span>
        </div>
        <div className='bdr'>
          <span>Total</span>
          <span>₦1,800,000</span>
        </div>
      </div>
      <div className='sec-title'>Approval chain</div>
      <div className='tl'>
        <div className='tls'>
          <div className='tld d'>✓</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>
              Ngozi Adeyemi — submitted
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
              }}>
              Today 9:10am
            </div>
          </div>
        </div>
        <div className='tls'>
          <div className='tld p'>!</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>
              Chidi Obi — Finance (you)
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
              }}>
              Your approval is needed
            </div>
            <div className='tl-actions'>
              <button
                type='button'
                className='btn-sm-ghost'
                onClick={() => addToast("Approval rejected (demo)", "error")}>
                Reject
              </button>
              <button
                type='button'
                className='btn-sm-primary'
                onClick={() => addToast("Run approved (demo)", "success")}>
                Approve
              </button>
            </div>
          </div>
        </div>
        <div className='tls'>
          <div className='tld w'>—</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>
              No Level 2 approver set
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
              }}>
              Optional — add in Settings
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
