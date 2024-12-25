import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplyLeaveModal from "./ApplyLeaveModal";
import DescriptionModal from "./DescriptionModal";
import Loading from "../Loading/Loading";

const RequestLeave = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState({
    isOpen: false,
    fullDescription: "",
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Helper function to format dates as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Helper function to calculate the number of days between two dates
  const calculateDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start date
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(
          "https://management-system-jet.vercel.app/api/leave/getSingleLeave",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaveRequests(response.data.leaveDetails);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError("Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [token]);

  const toggleApplyLeaveModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openDescriptionModal = (description) => {
    setDescriptionModal({ isOpen: true, fullDescription: description });
  };

  const closeDescriptionModal = () => {
    setDescriptionModal({ isOpen: false, fullDescription: "" });
  };

  const addNewLeave = (newLeave) => {
    setLeaveRequests((prev) => [newLeave, ...prev]); // Add the new leave request to the top
  };

  if (loading) {
    return <Loading message="Loading employee data..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 py-3 shadow-md bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leave Requests</h2>
        <button
          onClick={toggleApplyLeaveModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Apply Leave
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-2">S No</th>
              <th className="px-4 py-2">Employee ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request, index) => (
              <tr
                key={request.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-4 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">{request.employeeId}</td>
                <td className="px-4 py-2 text-center">{request.name}</td>
                <td className="px-4 py-2 text-center">
                  {formatDate(request.from)}
                </td>
                <td className="px-4 py-2 text-center">
                  {formatDate(request.to)}
                </td>
                <td className="px-4 py-2 text-center">
                  {calculateDays(request.from, request.to)}
                </td>
                <td className="px-4 py-2">
                  {request.description.split(" ").slice(0, 3).join(" ")}...
                  <button
                    onClick={() => openDescriptionModal(request.description)}
                    className="text-blue-500 ml-2 underline"
                  >
                    Read More
                  </button>
                </td>
                <td
                  className={`px-4 py-2 text-center font-bold ${
                    request.status === "Approved"
                      ? "text-green-500"
                      : request.status === "Rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplyLeaveModal
        isOpen={isModalOpen}
        toggleModal={toggleApplyLeaveModal}
        addNewLeave={addNewLeave} // Pass the callback function
      />

      <DescriptionModal
        isOpen={descriptionModal.isOpen}
        description={descriptionModal.fullDescription}
        closeModal={closeDescriptionModal}
      />
    </div>
  );
};

export default RequestLeave;
