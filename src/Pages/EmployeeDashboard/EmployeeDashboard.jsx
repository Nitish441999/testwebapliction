import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../../Components/Sidebar/EmployeeSidebar";
import EmployeeDashboardContent from "../../Components/DashboardContent/EmployeeDashboardContent"; // Import DashboardContent
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState(
    localStorage.getItem("activeComponent") || "Dashboard" // Retrieve from localStorage or default to "Dashboard"
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    // Save activeComponent to localStorage whenever it changes
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("image");
    localStorage.removeItem("activeComponent"); // Clear saved state on logout
    navigate("/"); // Redirect to home page after logout
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="relative h-screen ">
      {/* Navbar - Fixed at the top */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        onLogoutModal={handleLogoutModal} // Pass the logout modal handler
      />

      {/* Layout Wrapper */}
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Sidebar - Fixed on the left */}
        <div
          className={`fixed md:relative z-20 w-64 bg-gray-800 text-white h-full p-5 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <EmployeeSidebar
            onOptionSelect={(option) => {
              setActiveComponent(option);
              setIsSidebarOpen(false); // Close sidebar on small screens
            }}
            options={[
              "Dashboard",
              "Profile",
              "WorkReports",
              "Leave",
              "Attendances",
              "Settings",
            ]} // Ensure "Dashboard" is in the options
            onLogoutModal={handleLogoutModal}
          />
        </div>
        {/* Overlay for Mobile - Appears when the sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        {/* Main Content */}
        <div className="flex-1 ml-0 overflow-y-auto p-3">
          {/* Render the dynamic dashboard content */}
          <EmployeeDashboardContent activeComponent={activeComponent} />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-10 py-2 bg-white text-gray-800 border-2 border-red-600 shadow-md text-2xl rounded-xl hover:bg-red-600"
              >
                NO
              </button>
              <button
                onClick={handleLogout}
                className="px-10 py-2 bg-white border-2 text-gray-800 border-green-600 shadow-md text-2xl rounded-xl hover:bg-green-600"
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
