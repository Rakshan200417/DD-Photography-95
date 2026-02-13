import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import AboutFAQ from "./pages/AboutFAQ";
import Order from "./pages/Order";
import UserAuth from "./pages/UserAuth";
import UserMessages from "./pages/UserMessages";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/AdminLogin";
import CategoryPage from "./pages/CategoryPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminCarousel from "./pages/admin/AdminCarousel";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:category" element={<CategoryPage />} />
        <Route path="/about" element={<AboutFAQ />} />
        <Route path="/order" element={<Order />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/UserAuth" element={<UserAuth />} />
        <Route path="/UserMessage" element={<UserMessages />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardHome />} />  {/* default /admin */}
          <Route path="carousel" element={<AdminCarousel />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}
