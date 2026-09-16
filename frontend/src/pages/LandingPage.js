import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GallerySection from "../components/sections/GallerySection";
import AboutSection from "../components/sections/AboutSection";
import OrderSection from "../components/sections/OrderSection";
import { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const ThreeDScene = lazy(() => import("../components/ThreeDScene"));

export default function LandingPage() {
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="landing-page position-relative" style={{ backgroundColor: "var(--bg-color)" }}>
      <Navbar />

      {/* Viewport-Fixed 3D Camera Canvas (Central Visual Thread) */}
      <Suspense fallback={null}>
        <ThreeDScene />
      </Suspense>

      {/* Hero Section */}
      <section
        id="home"
        className="hero-section position-relative overflow-hidden d-flex align-items-center"
        style={{ minHeight: "100vh", paddingTop: "80px" }}
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center min-vh-100 py-5">
            {/* Left Column: Dedicated 3D Interactive Camera Stage Zone (Cleaned of all unwanted badges) */}
            <div
              className="col-lg-6 mb-5 mb-lg-0 position-relative d-flex flex-column justify-content-center hero-camera-zone"
            >
              {/* Clean stage zone dedicated entirely to the 3D Camera */}
            </div>

            {/* Right Column: DD PHOTOGRAPHY 95 Luxury Brand Presentation */}
            <div className="col-lg-6 text-lg-start text-center ps-lg-5 ps-xl-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-3"
              >
                <span
                  className="badge rounded-pill px-3 py-2 fw-semibold"
                  style={{
                    background: "rgba(181, 98, 46, 0.18)",
                    color: "var(--accent-color)",
                    border: "1px solid rgba(181, 98, 46, 0.4)",
                    letterSpacing: "1.5px",
                    fontSize: "0.8rem",
                  }}
                >
                  LUXURY CINEMATIC PHOTOGRAPHY
                </span>
              </motion.div>

              {/* DD PHOTOGRAPHY 95 Brand Title with Theme-Adaptive High Contrast */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="hero-brand-title display-2 fw-bold mb-3 d-flex flex-wrap justify-content-lg-start justify-content-center align-items-baseline"
                style={{
                  letterSpacing: "2px",
                  lineHeight: "1.1",
                }}
              >
                <span className="brand-word brand-dd me-3">DD</span>
                <span className="brand-word brand-photo me-3">PHOTOGRAPHY</span>
                <span className="brand-word brand-number">95</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="lead mb-4"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.2rem",
                  fontWeight: "300",
                  maxWidth: "520px",
                  lineHeight: "1.7",
                }}
              >
                Capturing the essence of every moment through a unique luxury lens. Precision engineered for timeless memories and unforgettable milestones.
              </motion.p>

              {/* Action Button: Explore Gallery Only (Book Session removed as requested) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="d-flex gap-3 justify-content-lg-start justify-content-center flex-wrap mb-5"
              >
                <a
                  href="#gallery"
                  className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold d-inline-flex align-items-center gap-2"
                >
                  <span>Explore Gallery</span>
                  <FaArrowRight size={14} />
                </a>
              </motion.div>

              {/* Technical Specs Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="tech-specs-container d-flex gap-4 justify-content-lg-start justify-content-center flex-wrap pt-3"
                style={{ borderTop: "1px solid var(--border-color)" }}
              >
                <div>
                  <div className="fw-bold fs-5" style={{ color: "var(--accent-color)" }}>36.4 MP</div>
                  <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px" }}>FULL-FRAME RAW</small>
                </div>
                <div className="tech-specs-divider" style={{ width: "1px", background: "var(--border-color)" }} />
                <div>
                  <div className="fw-bold fs-5" style={{ color: "var(--text-primary)" }}>f/1.4</div>
                  <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px" }}>PRIME OPTICS</small>
                </div>
                <div className="tech-specs-divider" style={{ width: "1px", background: "var(--border-color)" }} />
                <div>
                  <div className="fw-bold fs-5" style={{ color: "var(--accent-color)" }}>100%</div>
                  <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px" }}>OPTICAL VIEWFINDER</small>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Ambient Dot Grid Overlay */}
        <div
          className="position-absolute top-0 left-0 w-100 h-100 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(181, 98, 46, 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.25,
            zIndex: 1,
          }}
        />
      </section>

      {/* Gallery Section */}
      <GallerySection />
      <div
        className="section-separator"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(181, 98, 46, 0.3), transparent)",
          margin: "60px 0",
        }}
      />

      {/* About Section */}
      <AboutSection />
      <div
        className="section-separator"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(181, 98, 46, 0.3), transparent)",
          margin: "60px 0",
        }}
      />

      {/* Order Section */}
      <OrderSection />

      <Footer />
    </div>
  );
}
