import React from "react";
import {
  FaTachometerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaCog,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";

function Sidebar({ onOptionSelect, options, onLogoutModal }) {
  // Mapping options to their respective icons
  const iconMapping = {
    Dashboard: <FaTachometerAlt />,
    Profile: <FaUserTie />,
    Leave: <FaCalendarAlt />,
    Attendances: <FaMoneyCheckAlt />,
    WorkReports: <FaFileAlt />,
    Settings: <FaCog />,
    Logout: <FaSignOutAlt />,
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {/* Menu Options */}
      <div className="flex-1 overflow-y-auto">
        <ul>
          {options.map((option) => (
            <li
              key={option}
              className="py-3 px-4 hover:bg-gray-700 cursor-pointer text-lg flex items-center space-x-2"
              onClick={() => onOptionSelect(option)} // Handle option selection
            >
              {/* Render corresponding icon for the option */}
              <span>{iconMapping[option]}</span>
              <span>{option}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto py-3 px-4 border-t border-gray-700">
        <button
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md text-lg md:text-xl font-medium"
          onClick={onLogoutModal} // Trigger logout modal
        >
          <FaSignOutAlt className="mr-2 inline" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
