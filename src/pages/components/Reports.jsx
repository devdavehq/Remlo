

export default function Reports(){
    return (
      <div className='reports-grid'>
        {[
          {
            t: "PAYE report",
            d: "Monthly tax per employee — FIRS.",
            c: 0,
          },
          {
            t: "Pension schedule",
            d: "Employee + employer per PFA.",
            c: 1,
          },
          { t: "Payslips", d: "PDF pack for all staff.", c: 2 },
          { t: "Audit log", d: "CSV export of actions.", c: 3 },
          { t: "Payroll summary", d: "Month-by-month totals.", c: 4 },
          { t: "NHF report", d: "Housing fund list.", c: 5 },
        ].map((x) => (
          <div
            key={x.t}
            className='report-card'
            style={{ borderLeft: "3px solid var(--accent-muted)" }}>
            <div className='swatch' style={{ opacity: 0.85 }} />
            <h4>{x.t}</h4>
            <p>{x.d}</p>
            <div className='dl'>↓ Download (demo)</div>
          </div>
        ))}
      </div>
    );
}