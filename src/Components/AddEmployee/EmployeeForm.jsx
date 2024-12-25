import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { handleError, handleSuccess } from "../util";

const EmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    joiningDate: "",
    email: "",
    password: "",
    mobile: "",
    jobRole: "",
    salary: "",
    aadhar: "",
    panCard: "",
    gender: "",
    dob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format date fields to yyyy-mm-dd
    let formattedValue = value;
    if (name === "joiningDate" || name === "dob") {
      formattedValue = new Date(value).toISOString().split("T")[0];
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const {
      name,
      joiningDate,
      email,
      password,
      mobile,
      jobRole,
      salary,
      aadhar,
      panCard,
      gender,
      dob,
    } = formData;

    if (
      !name ||
      !joiningDate ||
      !email ||
      !password ||
      !mobile ||
      !jobRole ||
      (!salary && salary !== "0" && salary.toUpperCase() !== "NA") ||
      !aadhar ||
      !panCard ||
      !gender ||
      !dob
    ) {
      return handleError("All fields are required.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return handleError("Please enter a valid email address.");
    }

    if (!/^\d{10}$/.test(mobile)) {
      return handleError("Please enter a valid 10-digit mobile number.");
    }

    if (salary !== "NA" && (isNaN(salary) || parseFloat(salary) < 0)) {
      return handleError("Please enter a valid salary or 'NA'.");
    }

    if (!/^\d{12}$/.test(aadhar)) {
      return handleError("Please enter a valid 12-digit Aadhar number.");
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCard)) {
      return handleError("Please enter a valid PAN card number.");
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://management-system-jet.vercel.app/api/auth/addEmployee",
        formData
      );
      const { message } = response.data;
      if (response.status === 201) {
        handleSuccess("Employee added successfully.");
        setFormData({
          name: "",
          joiningDate: "",
          email: "",
          password: "",
          mobile: "",
          jobRole: "",
          salary: "",
          aadhar: "",
          panCard: "",
          gender: "",
          dob: "",
        });
        onSubmit(response.data);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      handleError("Failed to add employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 md:p-6 rounded shadow-md w-full max-w-4xl overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 uppercase text-center">
          Add Employee
        </h3>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2">DOB</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Job Role</label>
              <select
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Job Role</option>
                <option value="Full-stack Developer">
                  Full-stack Developer
                </option>
                <option value="Back-end Developer">Back-end Developer</option>
                <option value="Front-end Developer">Front-end Developer</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Pan Card</label>
              <input
                type="text"
                name="panCard"
                value={formData.panCard}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Aadhar Number</label>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white py-2 px-4 rounded w-full md:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
