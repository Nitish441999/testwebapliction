import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast library
import Loading from "../Loading/Loading"; // Assuming the Loading component is defined elsewhere

const WorkReport = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [workReports, setWorkReports] = useState([]);
  const [reportData, setReportData] = useState({
    workReport: "", // Only this field remains
  });
  const [expandedReportIndex, setExpandedReportIndex] = useState(null);
  const [modalData, setModalData] = useState(null); // Store data for modal
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [loadingTime, setLoadingTime] = useState(true); // New state for loading delay

  const apiBaseUrl =
    "https://management-system-jet.vercel.app/api/report/workereportCreate"; // URL to fetch data

  // Toggle form visibility
  const handleButtonClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({
      ...reportData,
      [name]: value,
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reportData.workReport) {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        // Send data to backend API with token in Authorization header
        const response = await axios.post(
          apiBaseUrl,
          {
            workReport: reportData.workReport,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token as Bearer token
            },
          }
        );

        // Assuming the backend returns the new report with a serial number and date
        if (response.data) {
          const newReport = {
            ...response.data.report,
            serialNo: workReports.length + 1, // Add a serial number to the new report
          };

          // Update the state with the new report
          setWorkReports([newReport, ...workReports]);
          setReportData({
            workReport: "", // Reset after submitting
          });
          setIsFormVisible(false); // Close the form after submitting

          // Display toast notification
          toast.success("Work report submitted successfully!");
        }
      } catch (error) {
        console.error("Error submitting work report:", error);
        toast.error("Error submitting work report. Please try again.");
      }
    } else {
      toast.error("Please fill out the work report field");
    }
  };

  // Handle the "Read More" click
  const handleReadMore = (index) => {
    if (expandedReportIndex === index) {
      setExpandedReportIndex(null); // Collapse if it's already expanded
      setModalData(null); // Close the modal
    } else {
      setExpandedReportIndex(index); // Expand
      setModalData(workReports[index]); // Set data for the modal
    }
  };

  // Fetch data from the API
  const fetchWorkReports = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const id = localStorage.getItem("id");

      const response = await axios.get(
        `https://management-system-jet.vercel.app/api/report/singaleReport/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkReports(response.data.report); // Assuming response data has a 'reports' field
      setIsLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error("Error fetching work reports:", error);
      setIsLoading(false); // Stop loading even if there's an error
    }
  };

  // Fetch work reports on component mount
  useEffect(() => {
    fetchWorkReports(); // Fetch reports when the component mounts

    // Simulate loading time of 1 second before displaying the form
    setTimeout(() => {
      setLoadingTime(false);
    }, 1000);
  }, []);

  // Format date to d/m/y
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${
      formattedDate.getMonth() + 1
    }/${formattedDate.getFullYear()}`;
  };

  // Function to display only 3 words of the report
  const previewReport = (reportText) => {
    const words = reportText.split(" ");
    return words.length > 3 ? words.slice(0, 10).join(" ") + "..." : reportText;
  };

  return (
    <div className="p-2 space-y-6 shadow-md rounded-md shadow-gray-400">
      {/* Send Report Button */}
      <div className="flex justify-end">
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isFormVisible ? "Close Form" : "Send Report"}
        </button>
      </div>

      {/* Loading indicator before form */}
      {loadingTime ? (
        <Loading />
      ) : (
        <>
          {/* Work Report Form */}
          {isFormVisible && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Submit Work Report
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">
                    Work Report
                  </label>
                  <textarea
                    name="workReport"
                    value={reportData.workReport}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Work Reports Table */}
          <div className="mt-6 overflow-x-auto">
            {isLoading ? (
              <Loading />
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className=" bg-red-600">
                    <th className=" px-4 py-2">SNo.</th>
                    <th className=" px-4 py-2">Name</th>
                    <th className=" px-4 py-2">Date</th>
                    <th className=" px-4 py-2">WorkReport</th>
                  </tr>
                </thead>
                <tbody>
                  {workReports.map((report, index) => (
                    <tr key={index} className=" text-center hover:bg-gray-100">
                      <td className="border px-4 py-3">{index + 1}</td>
                      <td className="border px-4 py-3">{report.name}</td>
                      <td className="border px-4 py-3">
                        {formatDate(report.date)}
                      </td>
                      <td className="border px-4 py-3">
                        <div className="flex items-center px-5">
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
                className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-md:w-5/6 "
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <h3 className="text-xl font-semibold mb-4">
                  Work Report Details
                </h3>
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
        </>
      )}
    </div>
  );
};

export default WorkReport;
