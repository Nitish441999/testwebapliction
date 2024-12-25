import React, { useState } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../util";
import { useNavigate } from "react-router-dom";

const ApplyLeaveModal = ({ isOpen, toggleModal }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState(""); // New state for form validation
  const navigate = useNavigate()

  if (!isOpen) return null;

  // Retrieve the token and employeeId from localStorage
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("id"); // Assuming employeeId is stored in localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors
    setFormError(""); // Clear previous form validation errors

    // Validate that all fields are filled
    if (!fromDate || !toDate || !description) {
      setFormError("All fields are required.");
      setLoading(false);
      return;
    }

    // Check if token and employeeId are available
    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    if (!employeeId) {
      setError("Employee ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    // Convert the date format to ISO string (YYYY-MM-DDTHH:MM:SS.sssZ)
    const formattedFromDate = new Date(fromDate).toISOString();
    const formattedToDate = new Date(toDate).toISOString();

    // Prepare the leave request data
    const leaveData = {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      description,
      status: "Pending", // Set default status to 'Pending', backend will handle status updates
    };

    try {
      const response = await axios.post(
        "https://management-system-jet.vercel.app/api/leave/leaveRequest", // Your API endpoint
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the request headers
          },
        }
      );

      if (response.data.success) {
        handleSuccess(response.data.message);
        toggleModal(); // Close the modal after submission
      } else {
        handleError("Failed to submit leave request. Please try again.");
      }
    } catch (err) {
      // Log the error response for debugging
      handleError("Error response:", err.response ? err.response.data : err);

      setError(
        err.response && err.response.data
          ? err.response.data.message ||
              "Failed to submit leave request. Please try again."
          : "Failed to submit leave request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-2/4 max-sm:w-4/5 p-6 ">
        <h3 className="text-xl font-bold mb-4">Request Leave</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {formError && <p className="text-red-500 mb-4">{formError}</p>}{" "}
        {/* Show form validation error */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">From</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">To</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <textarea
              className="w-full border-gray-300 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Enter your reason for leave"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={toggleModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
