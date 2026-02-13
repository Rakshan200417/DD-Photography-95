import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-light p-3" style={{ width: "220px" }}>
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="list-unstyled">
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin">
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin/carousel">
              Carousel
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin/gallery">
              Gallery
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin/categories">
              Categories
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin/orders">
              Orders
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink className="nav-link" to="/admin/messages">
              Messages
            </NavLink>
          </li>
        </ul>

        <hr />
        <button className="btn btn-danger w-100" onClick={logout} to="/admin/messages">
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4 overflow-auto bg-white">
        <Outlet /> {/* All admin pages render here */}
      </div>
    </div>
  );
}
