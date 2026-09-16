import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaCameraRetro, FaCheckCircle, FaCalendarAlt, FaEnvelope, FaTag } from "react-icons/fa";

export default function BookingSuccess3DModal({ show, onHide, form = {} }) {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (show) {
      setFlashing(true);
      const timer = setTimeout(() => setFlashing(false), 700);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="border-0 bg-transparent"
      dialogClassName="booking-3d-modal-dialog"
    >
      <div
        className="position-relative overflow-hidden p-4 p-md-5 text-center shadow-2xl"
        style={{
          borderRadius: "32px",
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(181, 98, 46, 0.4)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(181, 98, 46, 0.25)",
          color: "var(--text-primary)",
        }}
      >
        {/* Simulated Camera Flash Effect */}
        <AnimatePresence>
          {flashing && (
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#FFFFFF",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* 3D Camera Aperture Mechanical Iris */}
        <div className="position-relative d-inline-flex justify-content-center align-items-center mb-4">
          <motion.div
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B5622E 0%, #D4A373 100%)",
              padding: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(181, 98, 46, 0.4)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "var(--surface-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-color)",
              }}
            >
              <FaCameraRetro size={38} />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1 shadow"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <FaCheckCircle size={22} />
          </motion.div>
        </div>

        {/* Brand & Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span
            className="badge rounded-pill px-3 py-2 fw-bold mb-2"
            style={{
              background: "rgba(181, 98, 46, 0.15)",
              color: "var(--accent-color)",
              border: "1px solid rgba(181, 98, 46, 0.35)",
              letterSpacing: "1.5px",
              fontSize: "0.75rem",
            }}
          >
            RESERVATION SUBMITTED
          </span>

          <h3 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Thank You, <span style={{ color: "var(--accent-color)" }}>{form?.name || "Valued Client"}</span>!
          </h3>

          <p className="small mb-4" style={{ color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto" }}>
            Your photography session request has been registered with our studio team.
          </p>
        </motion.div>

        {/* Booking Summary Box with 3D Depth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="p-3 mb-4 text-start rounded-4 shadow-sm"
          style={{
            background: "var(--surface-hover)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaTag style={{ color: "var(--accent-color)" }} />
            <span className="small text-secondary">Package Tier:</span>
            <strong className="ms-auto text-capitalize" style={{ color: "var(--text-primary)" }}>
              {form?.packageType || "Standard Tier"}
            </strong>
          </div>

          {form?.eventDate && (
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaCalendarAlt style={{ color: "var(--accent-color)" }} />
              <span className="small text-secondary">Shoot Date:</span>
              <strong className="ms-auto" style={{ color: "var(--text-primary)" }}>
                {new Date(form.eventDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </strong>
            </div>
          )}

          {form?.email && (
            <div className="d-flex align-items-center gap-2">
              <FaEnvelope style={{ color: "var(--accent-color)" }} />
              <span className="small text-secondary">Confirmation Email:</span>
              <span className="ms-auto small fw-semibold text-truncate" style={{ maxWidth: "180px", color: "var(--text-primary)" }}>
                {form.email}
              </span>
            </div>
          )}
        </motion.div>

        {/* Notice about email verification */}
        <p className="small text-muted mb-4" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
          📧 Once our studio administrator confirms your session, an automated confirmation receipt with studio shoot guidelines will be delivered directly to your inbox.
        </p>

        {/* Dismiss Button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(181, 98, 46, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onHide}
          className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow"
          style={{ letterSpacing: "1px" }}
        >
          PERFECT, RETURN TO SITE
        </motion.button>
      </div>
    </Modal>
  );
}
