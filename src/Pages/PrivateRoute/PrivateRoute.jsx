import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token) {
      setAuthenticated(true);

      if (
        location.pathname === "/" ||
        location.pathname === "/employeeDashboard" ||
        location.pathname === "/adminDashboard"
      ) {
        if (userRole === "employee") {
          navigate("/employeeDashboard");
        } else if (userRole === "admin") {
          navigate("/adminDashboard");
        }
      }
    } else {
      setAuthenticated(false);
    }
  }, [location, navigate]);

  // Render protected element or redirect
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
