import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../util";

// Create a Context for user authentication and employee management
const UserContext = createContext();

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [singaleEmployee, setSingleEmployee] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  const [singaleLeave, setSingaleLeave] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Base URL for API requests (can be set via environment variables)
  const apiBaseUrl = "https://management-system-jet.vercel.app"; // Use development URL by default

  // Function to update an employee's data
  const updateEmployee = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiBaseUrl}/api/employee/updateEmployee/${id}`, // Pass the employee ID in the URL path
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://management-system-jet.vercel.app/api/attendance/allAttendance", // Pass the employee ID in the URL path
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      setAttendanceData(response.data.allattendance);
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    }
  };

  // Function to delete an employee
  const deleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${apiBaseUrl}/api/employee/deleteEmployee/${id}`, // Consistent API URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleSuccess("Employee deleted successfully");
    } catch (error) {
      handleError("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiBaseUrl}/api/employee/getAllEmplyees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(response.data.employees); // Update employees state with the fetched data
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again.");
    }
  };

  const fetchSingleEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        setError(
          "Missing required authorization or user ID. Please log in again."
        );
        return;
      }

      const response = await axios.get(
        `${apiBaseUrl}/api/employee/getSingaleEmployee/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.employee) {
        setSingleEmployee(response.data.employee); // Update employee state with the fetched data
      } else {
        setError("No employee data found.");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load employee. Please try again."
      );
    }
  };

  const fetchDepartment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiBaseUrl}/api/department/getDepartment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(response.data.department); // Update departments state
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments. Please try again.");
    }
  };

  // Fetch Leaves
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiBaseUrl}/api/leave/getAllLeave`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeavesList(response.data.allLeave); // Update leaves state
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setError("Failed to load leaves. Please try again.");
    }
  };

  const fetchSingaleLeave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiBaseUrl}/api/leave/getSingleLeave`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingaleLeave(response.data.leaveDetails); // Update single leave state
    } catch (error) {
      console.error("Error fetching single leave:", error);
      setError("Failed to load leave details. Please try again.");
    }
  };

  // Use useEffect to fetch employees when the component mounts
  useEffect(() => {
    fetchAllEmployees(); // Call the function to fetch employees
    fetchSingleEmployee();
    fetchDepartment();
    fetchLeaves();
    fetchSingaleLeave();
    fetchAttendance();

    const interval = setInterval(() => {
      // fetchAllEmployees(); // Fetch data every 10 seconds
      fetchDepartment();
      fetchSingaleLeave();
      fetchAttendance();
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Leave interval for reference
  useEffect(() => {
    const leaveInterval = setInterval(() => {
      fetchLeaves(); // Fetch leaves every 20 seconds
    }, 20000);
    return () => clearInterval(leaveInterval); // Cleanup on unmount
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        loading,
        employees,
        singaleEmployee,
        departments,
        leavesList,
        singaleLeave,
        updateEmployee,
        deleteEmployee,
        attendanceData,
        error, // Include error state for displaying errors
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => useContext(UserContext);

export default AuthContextProvider;
