import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { handleError, handleSuccess } from "../util";

const AddDepartment = ({ showModal, setShowModal, addNewDepartment }) => {
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast.error("Department name cannot be empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedDepartmentName = newDepartmentName.toString().trim();

      const response = await axios.post(
        "https://management-system-jet.vercel.app/api/department/createDepartment",
        {
          departmentName: sanitizedDepartmentName,
        }
      );

      // Check if response is as expected
      const { message, CreateDepartment } = response.data;
      const { status } = response;

      if (status === 201 && CreateDepartment) {
        handleSuccess(message);
        // Add the new department to the parent state
        addNewDepartment(CreateDepartment);

        // Clear the form and close the modal
        setNewDepartmentName("");
        setShowModal(false);
      } else {
        toast.error(message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error creating department:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create department. Please try again.";
      handleSuccess(errorMessage);
      console.log("Toast error: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
          <h3 className="text-xl font-bold mb-4 text-center">
            Add New Department
          </h3>
          <input
            type="text"
            placeholder="Enter department name"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            className="w-full p-3 border rounded-md mb-4"
            disabled={isSubmitting}
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleAddDepartment}
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Department"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddDepartment;
