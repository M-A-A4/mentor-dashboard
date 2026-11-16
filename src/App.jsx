
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import AdminDashboard from "./pages/AdminDashboard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Tasks from "./pages/Tasks";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./App.css";

const queryClient = new QueryClient();

// Only administrators can access the admin dashboard.
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("mentor-dark-mode") === "true";

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme ? "dark" : "light"
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />

          <Route element={<ProtectedRoute />}>
            {/* Regular user dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="project/:id" element={<ProjectDetails />} />
            </Route>

            {/* Separate admin dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route
            path="/login"
            element={<Navigate to="/signin" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
