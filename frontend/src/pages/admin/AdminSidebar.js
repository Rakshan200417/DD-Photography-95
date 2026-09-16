import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaImages,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaSun,
  FaMoon
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <Link to="/home" className="text-decoration-none" title="Click to view live public website">
        <div className="admin-sidebar-logo" style={{ cursor: "pointer" }}>
          <h4>DD Photography 95</h4>
          <span className="admin-view-app-badge">ADMIN PANEL &bull; VIEW APP &rarr;</span>
        </div>
      </Link>

      <ul className="admin-sidebar-nav">
        <li>
          <NavLink className="admin-sidebar-link" to="/admin" end>
            <FaChartBar className="icon" /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink className="admin-sidebar-link" to="/admin/gallery">
            <FaImages className="icon" /> Gallery
          </NavLink>
        </li>

        <li>
          <NavLink className="admin-sidebar-link" to="/admin/orders">
            <FaClipboardList className="icon" /> Orders
          </NavLink>
        </li>

        <li>
          <NavLink className="admin-sidebar-link" to="/admin/users">
            <FaUsers className="icon" /> Users
          </NavLink>
        </li>

        <li>
          <NavLink className="admin-sidebar-link" to="/admin/settings">
            <FaCog className="icon" /> Settings
          </NavLink>
        </li>
      </ul>

      <div className="admin-sidebar-footer d-flex flex-column gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="admin-theme-btn d-flex align-items-center justify-content-center gap-2"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <FaSun size={15} color="#FFD700" /> : <FaMoon size={15} color="var(--accent-color)" />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button className="admin-logout-btn d-flex align-items-center justify-content-center gap-2" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
