import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCameraRetro, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();

  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    const userRole = localStorage.getItem("userRole");

    setIsUser(!!user || userRole === 'USER');
    setIsAdmin(userRole === 'ADMIN' || !!admin);
  }, [location]); // RE-RUN when route changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="navbar navbar-expand-lg navbar-custom fixed-top shadow-sm"
      style={{ 
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <FaCameraRetro size={26} color="var(--accent-color)" />
            <span className="fw-bold" style={{ color: "var(--nav-text)", letterSpacing: "1px" }}>DD Photography 95</span>
          </Link>
        </motion.div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">

            {[
              { path: "/home#home", label: "Home" },
              { path: "/home#gallery", label: "Gallery" },
              { path: "/home#about", label: "About/FAQ" },
              { path: "/home#order", label: "Order" }
            ].map((item, i) => (
              <motion.li key={i} whileHover={{ scale: 1.1 }} className="nav-item">
                {location.pathname === "/home" ? (
                  <a className="nav-link fw-semibold" href={item.path.split("#")[1] ? `#${item.path.split("#")[1]}` : "#home"}>
                    {item.label}
                  </a>
                ) : (
                  <Link className="nav-link fw-semibold" to={item.path}>
                    {item.label}
                  </Link>
                )}
              </motion.li>
            ))}

            {isAdmin && (
              <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                <Link className="nav-link fw-bold" to="/admin">
                  Admin Dashboard
                </Link>
              </motion.li>
            )}

            {!isUser && !isAdmin && (
              <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                <Link className="nav-link fw-bold" to="/login">
                  Login
                </Link>
              </motion.li>
            )}

            {(isUser || isAdmin) && (
              <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                <button className="btn btn-danger ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </motion.li>
            )}

            {/* Single Dark / Light Mode Toggle Button */}
            <motion.li whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="btn d-flex align-items-center justify-content-center p-0"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: theme === "dark" ? "rgba(43, 31, 23, 0.08)" : "rgba(255, 255, 255, 0.12)",
                  border: "1px solid var(--nav-border)",
                  color: theme === "dark" ? "var(--accent-color)" : "#FFD700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: theme === "dark" ? "0 2px 8px rgba(181, 98, 46, 0.2)" : "0 0 12px rgba(255, 215, 0, 0.35)"
                }}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle dark and light mode"
              >
                {theme === "dark" ? <FaSun size={17} /> : <FaMoon size={16} />}
              </button>
            </motion.li>

          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
