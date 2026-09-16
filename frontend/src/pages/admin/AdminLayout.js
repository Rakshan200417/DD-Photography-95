import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout-container">
      <AdminSidebar />
      <div className="admin-layout-content">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
