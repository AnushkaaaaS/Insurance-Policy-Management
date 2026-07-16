import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import AgentDashboard from "./pages/agent/Dashboard";
import Agents from "./pages/admin/Agents";
import Customers from "./pages/agent/Customers";
import Policies from "./pages/agent/Policies";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/agents"
  element={
    <ProtectedRoute allowedRole="admin">
      <Agents />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/policies"
  element={
    <ProtectedRoute allowedRole="agent">
      <Policies />
    </ProtectedRoute>
  }
/>

      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRole="agent">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/agent/customers"
  element={
    <ProtectedRoute allowedRole="agent">
      <Customers />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;