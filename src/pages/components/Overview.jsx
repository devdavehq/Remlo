

export default function Overview({ go, userName = "Ngozi Adeyemi" }) {
  return (
    <>
      <div className='welcome-section'>
        <div className='welcome-text'>
          <h2>Welcome back, {userName.split(" ")[0]} 👋</h2>
          <p>Here's what's happening with your payroll today.</p>
        </div>
      </div>
      <div className='stat-grid'>
        <div className='stat-card pos'>
          <div className='sl'>Paid this month</div>
          <div className='sv'>₦12.4M</div>
          <div className='ss'>63 employees</div>
        </div>
        <div className='stat-card warn'>
          <div className='sl'>Pending approval</div>
          <div className='sv'>1 run</div>
          <div className='ss'>Waiting on Finance</div>
        </div>
        <div className='stat-card err'>
          <div className='sl'>Failed payments</div>
          <div className='sv'>0</div>
          <div className='ss'>All clear</div>
        </div>
        <div className='stat-card'>
          <div className='sl'>Wallet balance</div>
          <div className='sv'>₦4.2M</div>
          <div className='ss'>Updated now</div>
        </div>
      </div>

      <div className='sec-title'>Getting started</div>
      <div className='checklist'>
        <div className='cl-head'>
          <span className='cl-title'>Setup checklist</span>
          <span className='cl-prog'>3 of 5 done</span>
        </div>
        <div className='cl-row'>
          <div className='cl-check done'>
            <svg width='8' height='8' viewBox='0 0 8 8' fill='none' aria-hidden>
              <path
                d='M1 4l2 2 4-4'
                stroke='#fff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <span className='cl-label done'>Company account created</span>
        </div>
        <div className='cl-row'>
          <div className='cl-check done'>
            <svg width='8' height='8' viewBox='0 0 8 8' fill='none' aria-hidden>
              <path
                d='M1 4l2 2 4-4'
                stroke='#fff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <span className='cl-label done'>Employee ranks set up</span>
        </div>
        <div className='cl-row'>
          <div className='cl-check done'>
            <svg width='8' height='8' viewBox='0 0 8 8' fill='none' aria-hidden>
              <path
                d='M1 4l2 2 4-4'
                stroke='#fff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <span className='cl-label done'>Employees added (63)</span>
        </div>
        <div className='cl-row'>
          <div className='cl-check' />
          <span className='cl-label'>Fund your wallet</span>
          <button
            type='button'
            className='cl-action'
            onClick={() => go("wallet")}>
            Fund now →
          </button>
        </div>
        <div className='cl-row'>
          <div className='cl-check' />
          <span className='cl-label'>Invite your team members</span>
          <button
            type='button'
            className='cl-action'
            onClick={() => go("team")}>
            Invite →
          </button>
        </div>
      </div>

      <div className='sec-title'>Recent activity</div>
      <div className='act-list'>
        <div className='act-row'>
          <div className='dot p' />
          <div className='act-txt'>
            March salary run completed — 63 payments sent
          </div>
          <div className='act-t'>Today 11:32am</div>
        </div>
        <div className='act-row'>
          <div className='dot w' />
          <div className='act-txt'>
            Bonus run #012 submitted — waiting for Chidi
          </div>
          <div className='act-t'>Today 9:15am</div>
        </div>
        <div className='act-row'>
          <div className='dot n' />
          <div className='act-txt'>Chidi Obi accepted his team invite</div>
          <div className='act-t'>Yesterday</div>
        </div>
        <div className='act-row'>
          <div className='dot p' />
          <div className='act-txt'>4 new teachers added via bulk import</div>
          <div className='act-t'>Mar 24</div>
        </div>
        <div className='act-row'>
          <div className='dot e' />
          <div className='act-txt'>
            Wallet balance low — topped up ₦5,000,000
          </div>
          <div className='act-t'>Mar 20</div>
        </div>
      </div>
    </>
  );
}