import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "../icons/icons";

import {
  Overview,
  AddEmp,
  Employees,
  Empdetail,
  Approvals,
  PaymentHistory,
  NewPaymentRun,
  Reports,
  Settings,
  Team,
  Wallet,
} from "./components/Exports";
import RecentActivities from "./components/Recent-Activities";

import { TITLES } from "./Titles";
import SideBar from "./includes/Sidebar";
import TopBar from "./includes/Topbar";

export default function DashboardPage() {
 const location = useLocation();
 const navigate = useNavigate();

 const urlSection =
   new URLSearchParams(location.search).get("section") || "overview";
 const urlSubSection = new URLSearchParams(location.search).get("sub") || "";

  const [employees, setEmployees] = useState([
    {
      id: "emp-1",
      code: "EMP-010",
      name: "Amaka Osei",
      rank: "HOD",
      department: "Sciences",
      netSalary: 296000,
      active: true,
      email: "amaka@school.edu.ng",
      phone: "+2348012345678",
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
      phone: "+2348023456789",
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
      phone: "+2348034567890",
      dateHired: "2023-03-10",
    },
  ]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [approvalOn, setApprovalOn] = useState(false);

  // Derive title directly from URL - no useEffect needed!
  const getTitle = () => {
    if (urlSection === "history") {
      if (urlSubSection === "payments") return "Payment history";
      if (urlSubSection === "recent-activities") return "Recent activities";
      return "Payment history";
    }
    return TITLES[urlSection] || "Dashboard";
  };
  const title = getTitle();

  // Only keep useEffect for side effects (like resetting runStep)
  

  function go(nav, sub = "") {
    const params = new URLSearchParams(location.search);
    params.set("section", nav);
    if (sub) {
      params.set("sub", sub);
    } else if (nav !== "history") {
      params.delete("sub");
    }
    navigate(`/dashboard?${params.toString()}`);
  }

  // Determine what to render based on URL section and subsection
  const renderContent = () => {
    // History section with sub-sections
    if (urlSection === "history") {
      if (urlSubSection === "payments") {
        return <PaymentHistory />;
      }
      if (urlSubSection === "recent-activities") {
        return <RecentActivities />;
      }
      return <PaymentHistory />;
    }

    // Main sections
    switch (urlSection) {
      case "overview":
        return <Overview go={go} userName='Ngozi Adeyemi' />;
      case "payments":
        return <PaymentHistory />;
      case "new-run":
        return (
          <NewPaymentRun
            // Remove runStep and setRunStep props - let component manage itself
            go={go}
            employees={employees}
            walletBalance={4200000}
            approvalOn={approvalOn}
          />
        );
      case "employees":
        return (
          <Employees
            go={go}
            setempid={setSelectedEmployeeId}
            employees={employees}
            setEmployees={setEmployees}
          />
        );
      case "add-emp":
        return (
          <AddEmp
            setEmployees={setEmployees}
            setSelectedEmployeeId={setSelectedEmployeeId}
            go={go}
            employees={employees}
          />
        );
      case "wallet":
        return <Wallet />;
      case "reports":
        return <Reports />;
      case "approvals":
        return <Approvals />;
      case "emp-detail":
        return (
          <Empdetail
            selectedEmployeeId={selectedEmployeeId}
            employees={employees}
            setEmployees={setEmployees}
          />
        );
      case "team":
        return <Team />;
      case "settings":
        return (
          <Settings approvalOn={approvalOn} setApprovalOn={setApprovalOn} />
        );
      default:
        return <Overview go={go} userName='Ngozi Adeyemi' />;
    }
  };

  return (
    <div className='dashboard-root'>
      <div className='shell'>
        <SideBar go={go} section={urlSection} subSection={urlSubSection} />

        <div className='main'>
          <TopBar go={go} title={title} />

          <div className='content'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
