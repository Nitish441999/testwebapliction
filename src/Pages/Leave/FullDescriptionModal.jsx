import React from "react";

const FullDescriptionModal = ({ description, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[96%] sm:w-96  2xl:w-[40rem] max-w-full">
        <h2 className="text-xl font-semibold mb-4">Full Description</h2>
        <p>{description}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FullDescriptionModal;
