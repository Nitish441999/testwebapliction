import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  employeeName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold">Delete Confirmation</h3>
        <p>
          Are you sure you want to delete employee{" "}
          <strong>{employeeName}</strong>?
        </p>
        <div className="mt-4 flex justify-end gap-5">
          <button
            onClick={onCancel}
            className="px-10 py-3 bg-white text-black rounded-3xl hover:bg-red-700 hover:text-white border-2 border-red-500 font-semibold"
          >
            NO
          </button>
          <button
            onClick={onConfirm}
            className="px-10 py-3 bg-white text-black rounded-3xl hover:bg-green-700 hover:text-white border-2 border-green-500 font-semibold"
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
