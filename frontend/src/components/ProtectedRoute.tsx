import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: "admin" | "agent";
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userString);

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/agent"}
        replace
      />
    );
  }

  return <>{children}</>;
}