import React from "react";
import MainDashboard from "../MainDashboard/MainDashboard";
import Employee from "../Employees/Employees";
import Leave from "../../Pages/Leave/Leave";
import Department from "../Department/Department";
import WorkReport from "../WorkReport/WorkReports";
import AdminAttendance from "../Attendance/AdminAttendance";
import ChangePassword from "../ChangePassword/ChangePassword";

// Dashboard content component
const DashboardContent = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <MainDashboard />;
      case "Employee":
        return <Employee />;
      case "WorkReports":
        return <WorkReport />;
      case "Departments":
        return <Department />;
      case "Leave":
        return <Leave />;
      case "Attendance":
        return (
          <div>
            <AdminAttendance />
          </div>
        );
      case "Settings":
        return <div><ChangePassword/></div>;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="p-1 h-full overflow-y-auto ">
      {/* Render the active component content */}
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
