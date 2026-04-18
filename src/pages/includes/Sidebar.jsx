import { useState } from "react";
import RemloBrand from "../../components/RemloBrand";
import { Link } from "react-router-dom";

import {
  IconAddPerson,
  IconCheck,
  IconList,
  IconOverview,
  IconPeople,
  IconPlusRun,
  IconReport,
  IconSettings,
  IconTeam,
  IconUser,
  IconWallet,
  IconHistory,
  IconChevronDown,
} from "../../icons/icons";

export default function SideBar({ go, section, subSection }) {
  const [expandedMenus, setExpandedMenus] = useState({
    history: section === "history",
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (nav, sub = "") => {
    if (sub) {
      return section === nav && subSection === sub;
    }
    return section === nav;
  };

  const NAV = [
    { section: "overview", label: "Overview", Icon: IconOverview },
    { section: "new-run", label: "New payment run", Icon: IconPlusRun },
    { section: "employees", label: "Employees", Icon: IconPeople },
    { section: "add-emp", label: "Add employee", Icon: IconAddPerson },
    { section: "wallet", label: "Wallet", Icon: IconWallet },
    { section: "reports", label: "Reports", Icon: IconReport },
    { section: "approvals", label: "Approvals", Icon: IconCheck, badge: "1" },
    { section: "emp-detail", label: "Employee detail", Icon: IconUser },
    { section: "team", label: "Team & roles", Icon: IconTeam },
    { section: "settings", label: "Settings", Icon: IconSettings },
  ];

  return (
    <aside className='sidebar'>
      <div className='brand'>
        <RemloBrand size={120} onClickCycle initialVariant={0} />
      </div>
      <div className='nav-scroll'>
        <div className='nav-section'>Main</div>
        {NAV.slice(0, 2).map((item) => {
          const { section: id, label, badge } = item;
          const NavIcon = item.Icon;
          return (
            <button
              key={id}
              type='button'
              className={`nav-item${section === id ? " on" : ""}`}
              onClick={() => go(id)}>
              <NavIcon />
              {label}
              {badge ? <span className='badge'>{badge}</span> : null}
            </button>
          );
        })}

        {/* History with sub-nav */}
        <button
          type='button'
          className={`nav-item ${section === "history" ? "on" : ""}`}
          onClick={() => toggleMenu("history")}
          style={{ justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconList />
            History
          </span>
          <svg
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            style={{
              transform: expandedMenus.history
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
            <path d='M6 9l6 6 6-6' />
          </svg>
        </button>

        {expandedMenus.history && (
          <div className='sub-nav'>
            <button
              type='button'
              className={`nav-item-sub ${isActive("history", "payments") ? "on" : ""}`}
              onClick={() => go("history", "payments")}>
              <svg
                width='13'
                height='13'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'>
                <path d='M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h6' />
                <path d='M16 2v4h4M12 14L22 4' />
              </svg>
              Payment history
            </button>
            <button
              type='button'
              className={`nav-item-sub ${isActive("history", "recent-activities") ? "on" : ""}`}
              onClick={() => go("history", "recent-activities")}>
              <svg
                width='13'
                height='13'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'>
                <circle cx='12' cy='12' r='10' />
                <polyline points='12 6 12 12 16 14' />
              </svg>
              Recent activities
            </button>
          </div>
        )}

        {NAV.slice(2, 7).map((item) => {
          const { section: id, label, badge } = item;
          const NavIcon = item.Icon;
          return (
            <button
              key={id}
              type='button'
              className={`nav-item${section === id ? " on" : ""}`}
              onClick={() => go(id)}>
              <NavIcon />
              {label}
              {badge ? <span className='badge'>{badge}</span> : null}
            </button>
          );
        })}

        <div className='nav-section'>Admin</div>
        {NAV.slice(7).map((item) => {
          const { section: id, label, badge } = item;
          const NavIcon = item.Icon;
          return (
            <button
              key={id}
              type='button'
              className={`nav-item${section === id ? " on" : ""}`}
              onClick={() => go(id)}>
              <NavIcon />
              {label}
              {badge ? <span className='badge'>{badge}</span> : null}
            </button>
          );
        })}
      </div>
      <div className='co-foot'>
        <strong>Bright Future Academy</strong>
        Admin · Ngozi A. · <Link to='/login'>Sign out</Link>
      </div>
    </aside>
  );
}
