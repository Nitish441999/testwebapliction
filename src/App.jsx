import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./Components/Context/AuthContext"; // Import the provider
import Dashboard from "./Pages/Dashboard/Dashboard"; // Example Profile component
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
