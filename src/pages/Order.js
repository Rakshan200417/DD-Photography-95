import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  // Get data from URL
  const urlCategoryName = query.get("category");
  const urlPackageType = query.get("type");
  const urlCategoryId = query.get("categoryId");

  // State
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    message: "",
    categoryId: urlCategoryId ? parseInt(urlCategoryId) : "",
    packageType: urlPackageType || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories if not pre-filled or for selection
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
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
      price: "50000", // potentially dynamic based on package
      categoryId: parseInt(form.categoryId),
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", payload);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Booking failed!";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Book Your Photography Package</h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto card p-4 shadow"
          style={{ maxWidth: "600px" }}
        >
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="categoryId"
              className="form-select"
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={!!urlCategoryId} // Disable if pre-filled from URL
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Package Type</label>
            <select
              name="packageType"
              className="form-select"
              value={form.packageType}
              onChange={handleChange}
              required
              disabled={!!urlPackageType}
            >
              <option value="">Select Package</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              name="eventDate"
              className="form-control"
              required
              value={form.eventDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message (Optional)</label>
            <textarea
              name="message"
              className="form-control"
              rows="3"
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Booking...
              </span>
            ) : "Confirm Booking"}
          </button>
        </form>
      </div>

      {/* Booking confirmation modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); navigate('/home'); }}>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">Booking Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you <strong>{form.name}</strong>!</p>
          <p>Your booking for has been initialized. We will contact you shortly.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { setShowModal(false); navigate('/home'); }}>
            Back to Home
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
