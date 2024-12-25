import React from "react";
import Welcome from "../EmployeeProfile/Welcome";
import EmployeeProfile from "../EmployeeProfile/EmployeeProfile";
import RequestLeave from "../EmployeeProfile/RequestLeave";
import Attendance from "../Attendance/Attendance";
import WorkReport from "../EmployeeProfile/WorkReport";
import ChangePassword from "../ChangePassword/ChangePassword";

// Example components for sidebar content
const Dashboard = () => (
  <div>
    <Welcome />
  </div>
);
const Profile = () => (
  <div>
    <EmployeeProfile />
  </div>
);
const Leave = () => (
  <div>
    <RequestLeave />
  </div>
);
const Attendances = () => (
  <div>
    <Attendance />
  </div>
);
const WorkReports = () => (
  <div>
    <WorkReport />
  </div>
);
const Settings = () => (
  <div>
    <ChangePassword/>
  </div>
);

const DashboardContent = ({ activeComponent }) => {
  let content;
  switch (activeComponent) {
    case "Dashboard":
      content = <Dashboard />;
      break;
    case "Profile":
      content = <Profile />;
      break;
    case "Leave":
      content = <Leave />;
      break;
    case "Attendances":
      content = <Attendances />;
      break;
    case "WorkReports":
      content = <WorkReports />;
      break;
    case "Settings":
      content = <Settings />;
      break;
    default:
      content = (
        <div className="text-gray-500 text-center">
          Please select a section from the sidebar to view details.
        </div>
      );
      break;
  }

  return (
    <div className="p-1 h-full overflow-y-auto">
      {content}
    </div>
  );
};

export default DashboardContent;
