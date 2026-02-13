import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCameraRetro, FaCommentDots } from "react-icons/fa";
import UserMessageIcon from "../components/UserMessageIcon"; // import the icon component

export default function Navbar() {
  const location = useLocation();

  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    const email = localStorage.getItem("userEmail"); // user email from login

    setIsUser(!!user);
    setIsAdmin(!!admin);
    setUserEmail(email || "");
  }, [location]); // RE-RUN when route changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg"
      style={{ background: "linear-gradient(90deg, #0f0f0f, #1b1b1b)" }}
    >
      <div className="container">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.08 }}>
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <FaCameraRetro size={28} color="#ffd369" />
            <span className="fw-bold">DD Photography</span>
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

            {["/home", "/gallery", "/about", "/order"].map((path, i) => (
              <motion.li key={i} whileHover={{ scale: 1.1 }} className="nav-item">
                <Link className="nav-link text-white fw-semibold" to={path}>
                  {["Home", "Gallery", "About/FAQ", "Order"][i]}
                </Link>
              </motion.li>
            ))}

            {isAdmin && (
              <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/admin">
                  Admin Dashboard
                </Link>
              </motion.li>
            )}

            {!isUser && !isAdmin && (
              <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                <Link className="nav-link text-info fw-bold" to="/login">
                  Login
                </Link>
              </motion.li>
            )}

            {(isUser || isAdmin) && (
              <>
                {isUser && userEmail && (
                  <UserMessageIcon
                    userEmail={userEmail}
                    position="auto" // position handled inside component (bottom-right for desktop, top-right for mobile)
                  />
                )}

                <motion.li whileHover={{ scale: 1.1 }} className="nav-item">
                  <button className="btn btn-danger ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </motion.li>
              </>
            )}

          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
