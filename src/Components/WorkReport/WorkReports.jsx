import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast library
import Loading from "../Loading/Loading"; // Assuming the Loading component is defined elsewhere

const WorkReport = () => {
  const [workReports, setWorkReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [expandedReportIndex, setExpandedReportIndex] = useState(null);
  const [modalData, setModalData] = useState(null); // Store data for modal
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const apiBaseUrl =
    "https://management-system-jet.vercel.app/api/report/getAllReport"; // API URL

  // Fetch data from the API
  const fetchWorkReports = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.get(apiBaseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reports = response.data.reports || []; // Assuming response data has a 'report' field
      setWorkReports(reports);
      setFilteredReports(reports); // Initialize filteredReports
      setIsLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error("Error fetching work reports:", error);
      setIsLoading(false); // Stop loading even if there's an error
    }
  };

  // Fetch work reports on component mount
  useEffect(() => {
    fetchWorkReports(); // Fetch reports when the component mounts
  }, []);

  // Format date to d/m/y
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${
      formattedDate.getMonth() + 1
    }/${formattedDate.getFullYear()}`;
  };

  // Function to display only 10 words of the report
  const previewReport = (reportText) => {
    const words = reportText.split(" ");
    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : reportText;
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = workReports.filter(
      (report) =>
        report.name.toLowerCase().includes(query) ||
        formatDate(report.date).includes(query)
    );
    setFilteredReports(filtered);
  };

  // Handle the "Read More" click
  const handleReadMore = (index) => {
    if (expandedReportIndex === index) {
      setExpandedReportIndex(null); // Collapse if it's already expanded
      setModalData(null); // Close the modal
    } else {
      setExpandedReportIndex(index); // Expand
      setModalData(filteredReports[index]); // Set data for the modal
    }
  };

  return (
    <div className="p-2 space-y-6 shadow-md rounded-md bg-white">
      {/* Search Bar */}
      <div className=" flex justify-center pt-3">
        <div className="mb-2 w-[50rem] ">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name or date (e.g., 20/12/2024)"
            className="w-full p-3 border rounded-3xl"
          />
        </div>
      </div>

      {/* Work Reports Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <Loading />
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="px-4 py-2">SNo.</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Work Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={index} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-3">{index + 1}</td>
                  <td className="border px-4 py-3">{report.name}</td>
                  <td className="border px-4 py-3">
                    {formatDate(report.date)}
                  </td>
                  <td className="border px-4 py-3">
                    <div className="flex items-center">
                      <span>{previewReport(report.workReport)}</span>
                      <button
                        onClick={() => handleReadMore(index)}
                        className="ml-2 text-blue-500"
                      >
                        {expandedReportIndex === index
                          ? "Read Less"
                          : "Read More"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        )}
      </div>

      {/* Modal for Read More */}
      {modalData && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
          onClick={() => setModalData(null)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-md:w-5/6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-xl font-semibold mb-4">Work Report Details</h3>
            <p>{modalData.workReport}</p>
            <button
              onClick={() => setModalData(null)} // Close the modal
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkReport;
