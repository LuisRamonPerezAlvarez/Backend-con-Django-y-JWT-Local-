import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AdminLayout({ children }) {
  const { auth } = useAuth();

  // Si no está autenticado, no puede acceder a las vistas protegidas
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}

