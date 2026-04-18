export default function TopBar({ go, title }) {
  return (
    <header className='topbar'>
      <div className='tb-title'>{title}</div>
      <div className='tb-actions'>
        <button type='button' className='tb-btn'>
          Mar 2025
        </button>
        <button
          type='button'
          className='tb-btn primary'
          onClick={() => go("new-run")}>
          + New payment run
        </button>
      </div>
    </header>
  );
}