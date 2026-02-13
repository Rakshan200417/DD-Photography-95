import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px" }}
    >
      <h4 className="text-center mb-4">Admin Panel</h4>

      <ul className="nav flex-column gap-2">
        <li>
          <NavLink className="nav-link text-white" to="/admin">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link text-white" to="/admin/carousel">
            Home Carousel
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link text-white" to="/admin/gallery">
            Gallery
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link text-white" to="/admin/orders">
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link text-white" to="/admin/messages">
            Messages
          </NavLink>
        </li>
      </ul>

      <hr className="text-secondary mt-4" />

      <button className="btn btn-danger w-100" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
