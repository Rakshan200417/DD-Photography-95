import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BookingSuccess3DModal from "../BookingSuccess3DModal";

export default function OrderSection() {
  const location = useLocation();

  // State
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    message: "",
    categoryId: "",
    packageType: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const catId = params.get("categoryId");

    if (type || catId) {
      setForm(prev => ({
        ...prev,
        packageType: type ? type.trim().toLowerCase() : prev.packageType,
        categoryId: catId ? parseInt(catId) : prev.categoryId
      }));
    }
  }, [location.search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://dd-photography-95.onrender.com/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId || !form.packageType) {
      alert("Please select a category and package type!");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      eventDate: form.eventDate,
      message: form.message,
      packageType: form.packageType,
      price: "50000",
      categoryId: parseInt(form.categoryId),
      userId: localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : null,
    };

    try {
      await axios.post("https://dd-photography-95.onrender.com/api/bookings", payload);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.response?.data?.error || "Booking failed!";
      alert(message);
      if (status === 401) {
        // Not authenticated — redirect to login
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="py-5 position-relative">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 fw-semibold mb-2"
              style={{
                background: "rgba(181, 98, 46, 0.12)",
                color: "var(--accent-color)",
                border: "1px solid rgba(181, 98, 46, 0.3)",
                fontSize: "0.75rem",
                letterSpacing: "1.5px",
              }}
            >
              RESERVE YOUR DATE
            </span>
            <h2 className="display-5 fw-bold" style={{ color: "var(--text-primary)" }}>
              Book Your <span style={{ color: "var(--accent-color)" }}>Session</span>
            </h2>
          </div>

          {/* Animated Luxury Dark/Light Glass "Box Form" Container */}
          <motion.div 
            className="mx-auto card border-0 p-4 p-md-5 shadow-2xl position-relative overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              maxWidth: "720px", 
              borderRadius: "32px", 
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25), 0 0 50px rgba(181, 98, 46, 0.12)",
              transition: "background 0.3s ease, border-color 0.3s ease"
            }}
          >
            {/* Viewfinder Target Header Badge */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <div className="d-flex align-items-center gap-2">
                <span className="radar-dot" style={{ backgroundColor: "#00E676" }} />
                <small className="fw-semibold" style={{ color: "#00E676", letterSpacing: "1px", fontSize: "0.75rem" }}>
                  AUTOFOCUS LOCKED ON RESERVATION
                </small>
              </div>
              <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>STEP 1 OF 1</small>
            </div>

            <form onSubmit={handleSubmit}>
              <motion.div 
                className="form-floating mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="orderName"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
                <label htmlFor="orderName">Full Name</label>
              </motion.div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <motion.div 
                    className="form-floating"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.18, duration: 0.5 }}
                  >
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="orderEmail"
                      placeholder="name@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                    <label htmlFor="orderEmail">Email Address</label>
                  </motion.div>
                </div>
                <div className="col-md-6 mb-3">
                  <motion.div 
                    className="form-floating"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.22, duration: 0.5 }}
                  >
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      id="orderPhone"
                      placeholder="+94"
                      required
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <label htmlFor="orderPhone">Phone Number</label>
                  </motion.div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <motion.div 
                    className="form-floating"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.28, duration: 0.5 }}
                  >
                    <select
                      name="categoryId"
                      className="form-select"
                      id="orderCategory"
                      value={form.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <label htmlFor="orderCategory">Session Type</label>
                  </motion.div>
                </div>
                <div className="col-md-6 mb-3">
                  <motion.div 
                    className="form-floating"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.32, duration: 0.5 }}
                  >
                    <select
                      name="packageType"
                      className="form-select"
                      id="orderPackage"
                      value={form.packageType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Package</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                    <label htmlFor="orderPackage">Package</label>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                className="form-floating mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.38, duration: 0.5 }}
              >
                <input
                  type="date"
                  name="eventDate"
                  className="form-control"
                  id="orderDate"
                  required
                  value={form.eventDate}
                  onChange={handleChange}
                />
                <label htmlFor="orderDate">Event Date</label>
              </motion.div>

              <motion.div 
                className="form-floating mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.44, duration: 0.5 }}
              >
                <textarea
                  name="message"
                  className="form-control"
                  id="orderMsg"
                  placeholder="Message"
                  style={{ height: '110px' }}
                  value={form.message}
                  onChange={handleChange}
                />
                <label htmlFor="orderMsg">Special Requests or Vision (Optional)</label>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "1rem", letterSpacing: "1px" }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <>
                    <span>CONFIRM & LOCK RESERVATION</span>
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <BookingSuccess3DModal
        show={showModal}
        onHide={() => setShowModal(false)}
        form={form}
      />

      <style>{`
        .form-floating input, .form-floating select, .form-floating textarea {
          background-color: var(--surface-color) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-secondary) !important;
        }
        .form-floating label { color: var(--text-secondary); }
        .form-select option { background-color: var(--surface-color); color: var(--text-secondary); }
      `}</style>
    </section>
  );
}

