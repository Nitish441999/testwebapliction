import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading"; // Import your Loading component

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [aadhar, setaadhar] = useState(""); // State to store Aadhaar number
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(true); // Initially set to true to show the loading screen
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 2-second loading delay before rendering the page content
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loading screen after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout if the component is unmounted
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !aadhar) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true); // Show loading indicator

    try {
      const response = await axios.post(
        "https://management-system-jet.vercel.app/api/password/changepassword",
        { email, newPassword, aadhar }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        navigate("/"); // Navigate back to login page after successful password change
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred while changing password.");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading indicator after request
    }
  };

  if (isLoading) {
    // Show loading spinner for 2 seconds
    return <Loading />;
  }

  return (
    <section className="flex justify-center items-centr relative my-24 ">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg z-20">
        <h2 className="font-bold text-3xl text-center text-[#002D74] mb-6">
          Change Password
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Registered Email
            </label>
            <input
              id="email"
              className="p-2 mt-1 rounded-xl border w-full"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="aadhar"
              className="block text-sm font-medium text-gray-700"
            >
              Aadhaar Number
            </label>
            <input
              id="aadhar"
              className="p-2 mt-1 rounded-xl border w-full"
              type="text"
              placeholder="Enter your Aadhaar number"
              value={aadhar}
              onChange={(e) => setaadhar(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                className="p-2 mt-1 rounded-xl border w-full"
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Aadhaar Number Input */}

          {/* Submit Button */}
          <button
            className="bg-[#002D74] text-white py-2 rounded-xl mt-4"
            type="submit"
            disabled={isLoading} // Disable button while loading
          >
            Change Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
