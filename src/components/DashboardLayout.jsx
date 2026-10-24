
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((previous) => !previous);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={closeSidebar}
      />

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className="dashboard-main">
        <Navbar onMenuClick={toggleSidebar} />

        <main className="dashboard-content">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          © 2026 Mentor Dashboard
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
