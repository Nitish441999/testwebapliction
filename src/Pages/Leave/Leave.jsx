import React, { useState, useEffect } from "react";
import axios from "axios";
import FullDescriptionModal from "./FullDescriptionModal";
import { useAuth } from "../../Components/Context/AuthContext";
import { toast } from "react-hot-toast"; // Import toast
import Loading from "../../Components/Loading/Loading";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescriptionModal, setShowFullDescriptionModal] =
    useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [filter, setFilter] = useState("All"); // State for filtering
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { leavesList } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (leavesList && Array.isArray(leavesList)) {
      setLeaves(leavesList);
      setFilteredLeaves(leavesList);

      // Add a 2-second delay before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLeaves([]);
      setFilteredLeaves([]);

      // Add a 2-second delay before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [leavesList]);
  // Handle leave status change (approve/reject)
  const handleAction = async (_id, actionType) => {
    setLoading(true); // Show loading while performing the action
    try {
      const response = await axios.put(
        `https://management-system-jet.vercel.app/api/leave/statusUpdate/${_id}`,
        { status: actionType === "approve" ? "Approved" : "Rejected" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the leave status locally
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === _id
              ? {
                  ...leave,
                  status: actionType === "approve" ? "Approved" : "Rejected",
                }
              : leave
          )
        );

        // Reapply the filter after updating the status
        applyFilter(filter);

        // Show toast notification
        toast.success(
          `Leave successfully ${
            actionType === "approve" ? "approved" : "rejected"
          }!`
        );
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to update leave status.");
    }
    setLoading(false); // Hide loading after the action completes
  };

  // Handle filter change
  const applyFilter = (status) => {
    setFilter(status);
    const filtered =
      status === "All"
        ? leaves
        : leaves.filter((leave) => leave.status === status);

    // Apply search query to filtered results
    const searched = filtered.filter(
      (leave) =>
        leave.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredLeaves(searched);
  };

  // Handle search query change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Apply search query to current filtered leaves
    const searched = leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(query.toLowerCase()) ||
        leave.employeeId.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLeaves(searched);
  };

  // Handle view full description
  const handleViewFullDescription = (description) => {
    setSelectedDescription(description);
    setShowFullDescriptionModal(true);
  };

  const closeFullDescriptionModal = () => {
    setShowFullDescriptionModal(false);
  };

  const truncateDescription = (description, charLimit = 0) => {
    return description.length > charLimit
      ? description.slice(0, charLimit) + "..."
      : description;
  };

  const calculateDaysAndFormat = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      days: diffDays,
      formattedFrom: from.toLocaleDateString("en-GB"),
      formattedTo: to.toLocaleDateString("en-GB"),
    };
  };

  const counts = {
    approved: leaves.filter((leave) => leave.status === "Approved").length,
    rejected: leaves.filter((leave) => leave.status === "Rejected").length,
    pending: leaves.filter((leave) => leave.status === "Pending").length,
  };

  return (
    <div className="relative">
      {/* Full-page Loading Spinner */}
      {loading && <Loading />}

      {/* Search bar and filter buttons */}
      <div className="flex max-md:flex-wrap space-y-3 justify-between items-center pb-2 rounded-lg w-full">
        <div className="flex gap-3 max-md:w-full px-2">
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="px-4 py-2 border rounded w-60 max-md:w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex max-md:flex-wrap justify-evenly gap-2">
          <button
            className={`font-semibold px-4 py-2 rounded bg-green-600 text-white max-md:w-2/5 ${
              filter === "Approved"
                ? "bg-green-500 text-white"
                : "hover:text-green-600 hover:bg-green-100"
            }`}
            onClick={() => applyFilter("Approved")}
          >
            Approved: {counts.approved}
          </button>
          <button
            className={`font-semibold px-4 py-2 rounded bg-red-500 text-white max-md:w-2/5  ${
              filter === "Rejected"
                ? "bg-red-500 text-white"
                : "hover:text-red-600 hover:bg-red-100"
            }`}
            onClick={() => applyFilter("Rejected")}
          >
            Rejected: {counts.rejected}
          </button>
          <button
            className={`font-semibold px-4 py-2 rounded bg-yellow-500 text-white max-md:w-2/5 ${
              filter === "Pending"
                ? "bg-yellow-500 text-white"
                : "hover:text-yellow-600 hover:bg-yellow-100"
            }`}
            onClick={() => applyFilter("Pending")}
          >
            Pending: {counts.pending}
          </button>
          <button
            className={`font-semibold px-4 py-2 rounded max-md:w-2/5 ${
              filter === "All"
                ? "bg-blue-500 text-white"
                : "text-blue-600 hover:bg-blue-100"
            }`}
            onClick={() => applyFilter("All")}
          >
            All Leaves
          </button>
        </div>
      </div>

      {!loading && (
        <div className="overflow-x-auto shadow-md">
          <table className="w-full text-sm text-left text-gray-500 bg-white shadow-md rounded-lg">
            <thead className="bg-red-500 uppercase text-white font-semibold ">
              <tr>
                <th className="px-4 py-3">S No</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Day(s)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => {
                const { days, formattedFrom, formattedTo } =
                  calculateDaysAndFormat(leave.from, leave.to);

                return (
                  <tr className="border-b hover:bg-gray-200" key={leave._id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{leave.employeeId}</td>
                    <td className="px-4 py-3 capitalize">{leave.name}</td>
                    <td className="px-4 py-2">
                      {truncateDescription(leave.description)}
                      <button
                        onClick={() =>
                          handleViewFullDescription(leave.description)
                        }
                        className="text-blue-500 ml-2 underline"
                      >
                        Read More
                      </button>
                    </td>
                    <td className="px-4 py-3">{formattedFrom}</td>
                    <td className="px-4 py-3">{formattedTo}</td>
                    <td className="px-4 py-3">{days}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        leave.status === "Approved"
                          ? "text-green-600"
                          : leave.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 flex">
                      <button
                        className="px-3 py-1 text-white bg-green-500 hover:bg-green-600 rounded"
                        onClick={() => handleAction(leave._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
                        onClick={() => handleAction(leave._id, "reject")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Full Description */}
      {showFullDescriptionModal && selectedDescription && (
        <FullDescriptionModal
          description={selectedDescription}
          onClose={closeFullDescriptionModal}
        />
      )}
    </div>
  );
};

export default Leave;
