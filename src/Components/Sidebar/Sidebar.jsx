import React from "react";
import {
  FaTachometerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaCog,
  FaSignOutAlt,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";

function Sidebar({ onOptionSelect, options, handleLogoutModal }) {
  // Map options to corresponding icons
  const optionIcons = {
    Dashboard: <FaTachometerAlt className="mr-2" />,
    Employee: <FaUserTie className="mr-2" />,
    WorkReports: <FaFileAlt className="mr-2" />,
    Departments: <FaBuilding className="mr-2" />,
    Leave: <FaCalendarAlt className="mr-2" />,
    Attendance: <FaMoneyCheckAlt className="mr-2" />,
    Settings: <FaCog className="mr-2" />,
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {/* Menu Options */}
      <div className="flex-1">
        <ul>
          {options.map((option) => (
            <li
              key={option}
              className="flex items-center py-3 px-4 hover:bg-gray-700 cursor-pointer text-lg"
              onClick={() => onOptionSelect(option)}
            >
              {optionIcons[option]} {/* Display the corresponding icon */}
              {option}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto py-3 px-4">
        <button
          className="w-full flex items-center justify-center text-lg bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg"
          onClick={handleLogoutModal} // Trigger logout modal
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
