import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminLayout.css";
import { FaBars } from "react-icons/fa";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout-container">
      {/* Mobile Top Navbar (Visible only on small screens) */}
      <div className="d-md-none admin-mobile-header d-flex justify-content-between align-items-center p-3 w-100 shadow-sm" style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', zIndex: 1001, position: 'fixed', top: 0 }}>
        <h5 className="m-0" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Admin Dashboard</h5>
        <button className="btn p-2" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <FaBars />
        </button>
      </div>

      <div className={`admin-sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && <div className="admin-sidebar-overlay d-md-none" onClick={() => setSidebarOpen(false)}></div>}

      <div className="admin-layout-content">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
