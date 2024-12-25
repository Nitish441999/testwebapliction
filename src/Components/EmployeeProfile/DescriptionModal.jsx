import React from "react";

const DescriptionModal = ({ isOpen, description, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 max-md:w-3/4">
        <h3 className="text-xl font-bold mb-4">Description</h3>
        <p className="mb-4">{description}</p>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DescriptionModal;
