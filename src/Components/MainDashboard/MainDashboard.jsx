import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  FaUsers,
  FaDollarSign,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa"; // Import icons
import Loading from "../Loading/Loading";
import LeaveGraph from "./LeaveGraph";
import AttendanceGraph from "./AttendanceGraph";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { leavesList, employees, attendanceData, departments } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        fullDate: date.toLocaleDateString("en-US"),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  const totalSalary = employees.reduce(
    (total, employee) => total + employee.salary,
    0
  );

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;

  const totalSalaryInMonth = employees.reduce((total, employee) => {
    const currentMonth = new Date().getMonth();
    const employeeMonth = new Date(employee.salaryDate).getMonth();
    if (currentMonth === employeeMonth) {
      return total + employee.salary;
    }
    return total;
  }, 0);

  const approvedCount = leavesList.filter(
    (leave) => leave.status === "Approved"
  ).length;
  const rejectedCount = leavesList.filter(
    (leave) => leave.status === "Rejected"
  ).length;
  const pendingCount = leavesList.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const getFilteredAttendanceCounts = () => {
    const grouped = { fullDay: {}, halfDay: {}, leave: {} };
    attendanceData.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString("en-US");
      const type = record.type;
      if (type === "fullDay" || type === "halfDay" || type === "leave") {
        grouped[type][date] = (grouped[type][date] || 0) + 1;
      }
    });
    return grouped;
  };

  const filteredAttendanceCounts = getFilteredAttendanceCounts();

  const leaveGraphData = {
    labels: last7Days.map((day) => day.day),
    datasets: [
      {
        label: "Leave Count",
        data: last7Days.map(
          (day) => filteredAttendanceCounts.leave[day.fullDate] || 0
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 0,
      },
    ],
  };

  const attendanceGraphData = {
    labels: last7Days.map((day) => day.day),
    datasets: [
      {
        label: "Attendance Count",
        data: last7Days.map(
          (day) =>
            (filteredAttendanceCounts.fullDay[day.fullDate] || 0) +
            (filteredAttendanceCounts.halfDay[day.fullDate] || 0)
        ),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-lg:p-4 p-1 space-y-8">
      {/* General Statistics */}
      <div className="bg-white pb-3 pt-3 px-3 rounded-md shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10 gap-6">
          <div className="p-4 bg-pink-100 rounded-md shadow px-16 text-pink-700">
            <h3 className="text-lg font-medium flex items-center">
              <FaDollarSign className="mr-2" /> Total Salary
            </h3>
            <p className="text-2xl font-bold pl-8 ">${totalSalaryInMonth}</p>
          </div>
          <div className="p-4 bg-pink-100 rounded-md shadow px-16 text-pink-700">
            <h3 className="text-lg font-medium flex items-center">
              <FaUsers className="mr-2" /> Total Employees
            </h3>
            <p className="text-2xl font-bold pl-8">{totalEmployees}</p>
          </div>
          <div className="p-4 bg-pink-100 rounded-md shadow px-16 text-pink-700">
            <h3 className="text-lg font-medium">Total Departments</h3>
            <p className="text-2xl font-bold pl-8">{totalDepartments}</p>
          </div>
          <div className="p-4 bg-green-300 rounded-md shadow px-16 text-green-700">
            <h3 className="text-lg font-medium flex items-center ">
              <FaCheck className="mr-2 " /> Approved Leaves
            </h3>
            <p className="text-2xl font-bold  pl-8">{approvedCount}</p>
          </div>
          <div className="p-4 bg-yellow-300 rounded-md shadow px-16 text-yellow-700">
            <h3 className="text-lg font-medium flex items-center ">
              <FaClock className="mr-2 " /> Pending Leaves
            </h3>
            <p className="text-2xl font-bold  pl-8">{pendingCount}</p>
          </div>
          <div className="p-4 bg-red-300 rounded-md shadow px-16 text-red-700">
            <h3 className="text-lg font-medium flex items-center ">
              <FaTimes className="mr-2 " /> Rejected Leaves
            </h3>
            <p className="text-2xl font-bold pl-8 ">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="flex max-md:flex-wrap gap-6">
        <LeaveGraph leaveGraphData={leaveGraphData} last7Days={last7Days} />
        <AttendanceGraph
          attendanceGraphData={attendanceGraphData}
          last7Days={last7Days}
        />
      </div>
    </div>
  );
};

export default MainDashboard;
