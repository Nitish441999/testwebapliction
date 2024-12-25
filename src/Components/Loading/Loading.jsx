import React, { useEffect, useState } from "react";

const Loading = ({ message = "Loading..." }) => {
  const [color, setColor] = useState("red"); // Default color is red

  useEffect(() => {
    let currentSecond = 0;

    const interval = setInterval(() => {
      currentSecond += 1;

      // Map seconds to colors
      if (currentSecond === 1) setColor("red");
      if (currentSecond === 2) setColor("yellow");
      if (currentSecond === 3) setColor("green");

      // Reset after 3 seconds
      if (currentSecond >= 3) {
        currentSecond = 0;
      }
    }, 2000); // Change color every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="flex flex-col items-center">
        <svg
          className={`animate-spin h-20 w-20 mb-4`}
          style={{ color }} // Apply dynamic color
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        {message && <p className="text-lg text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
