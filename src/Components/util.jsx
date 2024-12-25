import toast from "react-hot-toast";

export const handleError = (message) => {
  toast.error(message || "An error occurred.", {
    duration: 4000,
    position: "top-center",
  });
};

export const handleSuccess = (message) => {
  toast.success(message || "Operation successful!", {
    duration: 4000,
    position: "top-center",
  });
};
