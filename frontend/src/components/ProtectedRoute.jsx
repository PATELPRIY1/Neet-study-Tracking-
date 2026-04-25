import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    const checkAuth = async () => {
      try {
        await axios.get(`${VITE_API_URL}/api/auth/user`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // ⛔ IMPORTANT: prevent premature redirect
  if (isAuthenticated === null) {
    return <div>Checking auth...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;