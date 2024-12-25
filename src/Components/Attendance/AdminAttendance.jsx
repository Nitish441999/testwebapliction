import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../Loading/Loading";

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [todayStats, setTodayStats] = useState({
    fullDay: 0,
    halfDay: 0,
    leave: 0,
    totalAttendance: 0,
  });
  const [employeeStats, setEmployeeStats] = useState({
    fullDay: 0,
    halfDay: 0,
    leave: 0,
    totalAttendance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const todayDate = dayjs().format("YYYY/MM/DD");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://management-system-jet.vercel.app/api/attendance/allAttendance",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data.allattendance || [];
        setAttendanceData(data);
        setFilteredData(data);

        // Count today's attendance
        const todayRecords = data?.filter((item) => item.date === todayDate);
        setTodayCount(todayRecords.length);

        // Calculate today's stats
        const stats = todayRecords.reduce(
          (acc, record) => {
            acc[record.type]++;
            return acc;
          },
          { fullDay: 0, halfDay: 0, leave: 0 }
        );

        stats.totalAttendance = todayRecords.length - stats.leave; // Calculate total attendance
        setTodayStats(stats);
      } catch (error) {
        toast.error("Failed to fetch attendance data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [token, todayDate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = attendanceData.filter(
      (record) =>
        record.name.toLowerCase().includes(query) ||
        record.type.toLowerCase().includes(query) ||
        record.date.includes(query)
    );
    setFilteredData(filtered);
  };

  const handleEmployeeClick = (employeeName) => {
    setSelectedEmployee(employeeName);

    const stats = attendanceData.reduce(
      (acc, record) => {
        if (record.name === employeeName) {
          acc[record.type]++;
        }
        return acc;
      },
      { fullDay: 0, halfDay: 0, leave: 0 }
    );

    stats.totalAttendance =
      attendanceData.filter((record) => record.name === employeeName).length -
      stats.leave; // Calculate total attendance for selected employee
    setEmployeeStats(stats);
  };

  const handleTodaySummary = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-2">
      <Toaster />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Attendance Management
          </h2>
          <p className="text-lg font-semibold">
            Today:{" "}
            <span className="text-green-500">
              {dayjs().format("DD MMMM YYYY")}
            </span>
          </p>
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          {selectedEmployee
            ? `Attendance Summary for ${selectedEmployee}`
            : "Today's Attendance Summary"}
        </h3>

        <div className="flex justify-between max-md:flex-wrap gap-5">
          {(selectedEmployee ? employeeStats : todayStats) &&
            ["fullDay", "halfDay", "leave", "totalAttendance"].map(
              (type, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-lg p-4 w-64 h-32 max-md:w-full ${
                    type === "fullDay"
                      ? "bg-green-300 text-green-800"
                      : type === "halfDay"
                      ? "bg-yellow-300 text-yellow-800"
                      : type === "leave"
                      ? "bg-red-300 text-red-800"
                      : "bg-blue-300 text-blue-800"
                  }`}
                >
                  <h4 className="text-xl font-bold capitalize">
                    {type.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </h4>
                  <p className="text-2xl">
                    {selectedEmployee ? employeeStats[type] : todayStats[type]}
                  </p>
                </div>
              )
            )}
        </div>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Search by name, type, or date..."
          value={searchQuery}
          onChange={handleSearch}
          className="border-2 border-black rounded px-4 py-3 w-1/3 max-md:w-full"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {filteredData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((record, index) => (
                <tr
                  key={record._id} // Using unique identifier for key
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEmployeeClick(record.name)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === "fullDay"
                          ? "bg-green-100 text-green-800"
                          : record.type === "halfDay"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4 text-gray-500 font-semibold">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
