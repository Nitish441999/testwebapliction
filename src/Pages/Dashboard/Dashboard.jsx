import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import DashboardContent from "../../Components/DashboardContent/DashboardContent";
import Navbar from "../../Components/Navbar/Navbar"; // Assuming Navbar is correctly implemented
import { FaBars } from "react-icons/fa";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard"); // Default active component
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve the saved active component from localStorage on component mount
  useEffect(() => {
    const savedActiveComponent = localStorage.getItem("activeComponent");
    if (savedActiveComponent) {
      setActiveComponent(savedActiveComponent);
    }
  }, []);

  // Save the active component to localStorage whenever it changes
  useEffect(() => {
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
    localStorage.removeItem("activeComponent"); // Clear saved component on logout
    navigate("/"); // Redirect to the home page
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="relative h-screen bg-gray-50 ">
      {/* Navbar */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        onLogoutModal={handleLogoutModal}
      />
      {/* Layout Wrapper */}
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-20 w-64 bg-gray-600 text-white h-full transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar
            onOptionSelect={(option) => {
              setActiveComponent(option);
              setIsSidebarOpen(false); // Close sidebar on small screens
            }}
            options={[
              "Dashboard",
              "Employee",
              "WorkReports",
              "Attendance",
              "Leave",
              "Departments",
              "Settings",
            ]}
            handleLogoutModal={handleLogoutModal}
          />
        </div>
        {/* Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-5 max-lg:p-2 ">
          {/* Render dynamic content based on activeComponent */}
          <DashboardContent activeComponent={activeComponent} />
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

export default Dashboard;
