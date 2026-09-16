import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import StepForm from "../components/StepForm";
import BookingSuccess3DModal from "../components/BookingSuccess3DModal";

// Fallback categories — used when the backend API is unavailable or returns empty
const FALLBACK_CATEGORIES = [
  { id: 1,  name: "Wedding Photography" },
  { id: 2,  name: "Pre-Wedding Shoot" },
  { id: 3,  name: "Maternity Shoot" },
  { id: 4,  name: "Newborn Photography" },
  { id: 5,  name: "Birthday Coverage" },
  { id: 6,  name: "Corporate Events" },
  { id: 7,  name: "Fashion Portfolio" },
  { id: 8,  name: "Product Photography" },
  { id: 9,  name: "Real Estate" },
  { id: 10, name: "Family Portraits" },
  { id: 11, name: "Sports Photography" },
  { id: 12, name: "Travel Photography" },
];

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from URL

  // State
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [step, setStep] = useState(1);
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
  const [settings, setSettings] = useState({
    currency: "$",
    basicPrice: "250",
    standardPrice: "550",
    premiumPrice: "950"
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/settings")
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  // Helper to resolve categoryId and advance step from URL params + categories list
  const resolveCategoryFromUrl = (cats) => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const catId = params.get("categoryId");
    const catName = params.get("category");

    if (!catName && !catId && !type) return;

    let resolvedCatId = catId ? parseInt(catId) : null;

    // If we have a category name but no ID, resolve it from the loaded categories list
    if (!resolvedCatId && catName && cats.length > 0) {
      const normalize = (s) => s.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
      const normalizedCatName = normalize(catName);
      const matched = cats.find(c => {
        const cn = normalize(c.name);
        return cn === normalizedCatName || cn.includes(normalizedCatName) || normalizedCatName.includes(cn);
      });
      if (matched) resolvedCatId = matched.id;
    }

    setForm(prev => ({
      ...prev,
      packageType: type ? type.trim().toLowerCase() : prev.packageType,
      categoryId: resolvedCatId ? resolvedCatId : prev.categoryId,
    }));

    // Navigate to the appropriate step once we have both values resolved
    if (type && resolvedCatId) {
      setStep(3); // Jump straight to personal details — both are pre-selected
    } else if (resolvedCatId) {
      setStep(2); // Only category known — pick package next
    }
    // else stay on step 1
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run resolution whenever URL params change (handles normal navigation)
  useEffect(() => {
    if (!categoriesLoading) {
      resolveCategoryFromUrl(categories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      const fetchedCategories = response.data;
      // If backend returns empty, fall back to hardcoded list so the UI is never blank
      const resolved = fetchedCategories && fetchedCategories.length > 0
        ? fetchedCategories
        : FALLBACK_CATEGORIES;
      setCategories(resolved);
      // Immediately resolve URL params now that categories are available
      resolveCategoryFromUrl(resolved);
    } catch (error) {
      console.error("Error fetching categories — using fallback list:", error);
      // Backend unavailable: use hardcoded categories so the booking flow still works
      setCategories(FALLBACK_CATEGORIES);
      resolveCategoryFromUrl(FALLBACK_CATEGORIES);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.categoryId || !form.packageType) {
      alert("Please select a category and package type!");
      return;
    }

    setLoading(true);

    const getPriceForPackage = (type) => {
      const t = (type || "").toLowerCase();
      if (t.includes("basic")) return settings.basicPrice || "250";
      if (t.includes("premium")) return settings.premiumPrice || "950";
      return settings.standardPrice || "550";
    };

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      eventDate: form.eventDate,
      message: form.message,
      packageType: form.packageType,
      price: getPriceForPackage(form.packageType),
      categoryId: parseInt(form.categoryId),
      userId: localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : null,
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", payload);
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
    <>
      <Navbar />

      <div className="container" style={{ marginTop: "150px", marginBottom: "100px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="display-4 fw-bold" style={{ color: "var(--text-primary)" }}>
            Book Your <span style={{ color: "var(--accent-color)" }}>Experience</span>
          </h1>
          <p className="lead text-secondary">Follow the steps below to secure your date.</p>
        </motion.div>

        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <StepForm 
            step={step}
            setStep={setStep}
            form={form}
            setForm={setForm}
            categories={categories}
            categoriesLoading={categoriesLoading}
            handleSubmit={handleSubmit}
            isSubmitting={loading}
          />
        </div>
      </div>

      <BookingSuccess3DModal 
        show={showModal} 
        onHide={() => { setShowModal(false); navigate('/home'); }}
        form={form}
      />

      <Footer />
      <style>{`
        .border-accent { border: 1px solid var(--accent-color) !important; }
      `}</style>
    </>
  );
}

