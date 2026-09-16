import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaWhatsapp } from "react-icons/fa";

// Components
import LoadingScreen from "./components/LoadingScreen";

// Pages
import LandingPage from "./pages/LandingPage";
import Gallery from "./pages/Gallery";
import AboutFAQ from "./pages/AboutFAQ";
import Order from "./pages/Order";
import UserAuth from "./pages/UserAuth";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/AdminLogin";
import CategoryPage from "./pages/CategoryPage";
import PackagePage from "./pages/PackagePage";

import AdminLayout from "./pages/admin/AdminLayout";
import RequireAuth from "./components/RequireAuth";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";


function FloatingWhatsAppWidget() {
  const location = useLocation();
  
  // Hide on login pages and admin dashboard
  if (location.pathname.toLowerCase().includes('/login') || location.pathname.toLowerCase().includes('/userauth') || location.pathname.toLowerCase().includes('/adminlogin') || location.pathname.toLowerCase().startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/94755189759"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        width: "56px",
        height: "56px",
        backgroundColor: "#25D366",
        color: "#FFF",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        zIndex: 9999,
        cursor: "pointer",
        textDecoration: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Simulate initial load completion
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Router>
      <LoadingScreen isLoading={isLoading} />
      <div className="content-container">
        <Suspense fallback={<div className="loading-fallback">Loading Experience...</div>}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={<Navigate to="/home" replace />}
            />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:category" element={<CategoryPage />} />
            <Route path="/package/:id" element={<PackagePage />} />
            <Route path="/about" element={<AboutFAQ />} />
            <Route path="/order" element={<RequireAuth><Order /></RequireAuth>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/UserAuth" element={<UserAuth />} />

            {/* Admin routes */}
            <Route path="/admin" element={<RequireAuth adminOnly={true}><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="categories" element={<Navigate to="/admin/gallery" replace />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </div>

      {!isLoading && <FloatingWhatsAppWidget />}
    </Router>
  );
}

