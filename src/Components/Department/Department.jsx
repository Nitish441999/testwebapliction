import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { handleError, handleSuccess } from "../util";
import AddDepartment from "./AddDepartment"; // Import AddDepartment component
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false); // State for Add modal
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true); // Set loading to true before the fetch starts
      try {
        const response = await axios.get(
          "https://management-system-jet.vercel.app/api/department/getDepartment"
        );
        setDepartments(response.data.department || []);
      } catch (error) {
        handleError("Error fetching departments:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or error occurred
      }
    };

    fetchDepartments();
  }, []);

  // Delete Department From The API
  const handleDelete = async (_id) => {
    if (!_id) {
      handleError("ID is undefined or missing");
      return;
    }

    try {
      await axios.delete(
        `https://management-system-jet.vercel.app/api/department/deleteDepartment/${_id}`
      );
      setDepartments(
        departments.filter((department) => department._id !== _id)
      );
      handleSuccess("Department Deleted Successfully");
    } catch (error) {
      handleError("Error deleting department:");
      handleError("Error deleting department:", error);
    }
  };

  // Edit Department Functionality
  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setNewName(department.departmentName);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!currentDepartment || !newName.trim()) return;

    try {
      await axios.put(
        `https://management-system-jet.vercel.app/api/department/updateDepartment/${currentDepartment._id}`,
        { departmentName: newName }
      );
      setDepartments(
        departments.map((dept) =>
          dept._id === currentDepartment._id
            ? { ...dept, departmentName: newName }
            : dept
        )
      );
      handleSuccess("Department Updated Successfully");
      setEditModal(false);
      setCurrentDepartment(null);
      setNewName("");
    } catch (error) {
      handleError("Error updating department:");
      handleError("Error updating department:", error);
    }
  };

  // Add New Department Functionality
  const addNewDepartment = (department) => {
    setDepartments([...departments, department]);
  };

  const filteredDepartments = departments.filter((department) =>
    department.departmentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-md:p-1">
      {loading ? <Loading/>
        
      : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search Department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add New Department</span>
            </button>
          </div>

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-red-500">
                <tr>
                  <th className="px-6 py-3">S No.</th>
                  <th className="px-6 py-3">Department Name</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((department, index) => (
                  <tr
                    key={department.id}
                    className="bg-white border-b hover:bg-gray-200"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{department.departmentName}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(department)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(department._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Department Modal */}
          {addModal && (
            <AddDepartment
              showModal={addModal}
              setShowModal={setAddModal}
              addNewDepartment={addNewDepartment} // Pass function as prop
            />
          )}

          {/* Edit Department Modal */}
          {editModal && currentDepartment && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Edit Department</h2>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditModal(false)}
                    className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Department;
