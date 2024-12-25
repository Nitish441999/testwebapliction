import React from "react";

const LeaveDetailsModal = ({ leaveDetails, onClose }) => {
  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-6xl w-full shadow-lg transition-transform transform duration-300 ease-in-out">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Leave Details
        </h2>

        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-semibold">S No</th>
              <th className="px-4 py-2 font-semibold">ID</th>
              <th className="px-4 py-2 font-semibold">Name</th>
              <th className="px-4 py-2 font-semibold">Description</th>
              <th className="px-4 py-2 font-semibold">From</th>
              <th className="px-4 py-2 font-semibold">To</th>
              <th className="px-4 py-2 font-semibold">Days</th>
              <th className="px-4 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">{leaveDetails.id}</td>
              <td className="px-4 py-2">{leaveDetails.employeeId}</td>
              <td className="px-4 py-2">{leaveDetails.name}</td>
              <td className="px-4 py-2">{leaveDetails.description}</td>
              <td className="px-4 py-2">{leaveDetails.from}</td>
              <td className="px-4 py-2">{leaveDetails.to}</td>
              <td className="px-4 py-2">{leaveDetails.days}</td>
              <td
                className={`px-4 py-2 ${getStatusColor(leaveDetails.status)}`}
              >
                {leaveDetails.status}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
