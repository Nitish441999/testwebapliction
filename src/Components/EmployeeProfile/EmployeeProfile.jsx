import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading"; // Import the Loading component
import { useAuth } from "../Context.jsx/AuthContext";

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { singaleEmployee } = useAuth();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!singaleEmployee) {
          setError("Employee data not found.");
        } else {
          setEmployee(singaleEmployee);
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [singaleEmployee]);

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

  if (!employee) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-xl">No employee data found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-centermin-lg:p-4 bg-gray-50">
      {/* Profile Section */}
      <section className="w-full p-4 shadow-lg flex flex-col lg:flex-row gap-10 justify-center bg-white rounded-md">
        {/* Employee Image and Name */}
        <div className="flex flex-col items-center">
          <img
            src={
              employee.image
                ? `https://management-system-jet.vercel.app/${employee.image}`
                : "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
            }
            alt="Employee"
            className="w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-md object-cover shadow-md"
          />
          <h3 className="font-sans font-semibold tracking-widest text-center mt-2 text-lg uppercase">
            {employee.name || "Nitish Kumar"}
          </h3>
          <h3 className="font-sans font-medium tracking-widest text-center text-gray-500 uppercase">
            {employee.jobRole || "Developer"}
          </h3>
        </div>

        {/* Employee Details */}
        <div className="w-full lg:w-2/3 overflow-x-auto">
          <table className="w-full border border-gray-300 text-left capitalize">
            <tbody>
              {[
                ["Name", employee.name],
                ["Employee ID", employee._id],
                ["Email", employee.email],
                ["Aadhar Number", employee.aadhar],
                ["Pan Card Number", employee.panCard],
                ["Joining Date", employee.joiningDate],
                ["Phone Number", employee.mobile],
                ["Salary", employee.salary],
              ].map(([label, value], index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="px-4 py-2 font-semibold border border-gray-300">
                    {label}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default EmployeeProfile;
