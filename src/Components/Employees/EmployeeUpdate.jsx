// EmployeeUpdate.jsx
import React, { useState, useEffect } from "react";

const EmployeeUpdate = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    jobRole: "",
    salary: "",
    aadharNo: "", // Add Aadhar field
    panNo: "",    // Add PAN Card field
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        jobRole: employee.jobRole,
        salary: employee.salary,
        aadharNo: employee.aadhar || "", // Fill Aadhar if available
        panNo: employee.panCard || "",       // Fill PAN Card if available
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call the onSubmit prop to save the updated data
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Job Role</label>
        <input
          type="text"
          name="jobRole"
          value={formData.jobRole}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Salary</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Aadhar No</label>
        <input
          type="text"
          name="aadharNo"
          value={formData.aadharNo}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Pan Card No</label>
        <input
          type="text"
          name="panNo"
          value={formData.panNo}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Employee
        </button>
      </div>
    </form>
  );
};

export default EmployeeUpdate;
