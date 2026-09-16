import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children, adminOnly = false }) {
  const userToken = localStorage.getItem("user");
  const adminToken = localStorage.getItem("adminToken");

  if (adminOnly) {
    return adminToken ? children : <Navigate to="/login" replace />;
  }

  return userToken || adminToken ? children : <Navigate to="/login" replace />;
}
