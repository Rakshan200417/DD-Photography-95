import Accordion from 'react-bootstrap/Accordion';
import { motion } from "framer-motion";
import { FaCameraRetro, FaAward, FaGem } from "react-icons/fa";
import useTilt from "../../hooks/useTilt";

const AboutStatCard = ({ icon: Icon, stat, label, desc, delay }) => {
  const { tiltProps } = useTilt({ maxRotation: 12, scale: 1.05 });
  return (
    <div className="col-md-4 mb-4">
      <motion.div
        {...tiltProps}
        className="card border-0 h-100 p-4 text-center shadow-lg"
        style={{
          ...tiltProps.style,
          borderRadius: '24px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
      >
        <div className="position-relative" style={{ zIndex: 2, transform: 'translateZ(25px)' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle shadow-sm"
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(181, 98, 46, 0.15)',
              border: '1px solid rgba(181, 98, 46, 0.35)',
              color: 'var(--accent-color)',
              fontSize: '1.4rem'
            }}
          >
            <Icon />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--accent-color)' }}>{stat}</h3>
          <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</h6>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
        <div
          className="hover-glow"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(181, 98, 46, 0.18) 0%, transparent 75%)',
            pointerEvents: 'none'
          }}
        />
      </motion.div>
    </div>
  );
};

export default function AboutSection() {
  return (
    <section id="about" className="py-5 position-relative">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-4">
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
              OUR HERITAGE
            </span>
            <h2 className="display-5 fw-bold" style={{ color: "var(--text-primary)" }}>
              About <span style={{ color: "var(--accent-color)" }}>Us</span>
            </h2>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <p className="lead" style={{ lineHeight: '1.9', color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
                DD Photography is your premier photography service, capturing moments that last forever.
                From weddings to high-fashion portraits, we bring your timeless memories to life with precision optics, creative mastery, and authentic emotion.
              </p>
            </div>
          </div>

          {/* 3D Optical Glass Heritage Stats */}
          <div className="row g-4 mb-5 justify-content-center">
            <AboutStatCard
              icon={FaAward}
              stat="500+"
              label="Luxury Shoots"
              desc="Weddings, galas, and bespoke portraits executed with cinematic elegance."
              delay={0.1}
            />
            <AboutStatCard
              icon={FaCameraRetro}
              stat="85mm Prime"
              label="Optical Mastery"
              desc="Engineered depth of field and cream bokeh for magazine-grade imagery."
              delay={0.2}
            />
            <AboutStatCard
              icon={FaGem}
              stat="100% Raw"
              label="Master Color"
              desc="Every photo is calibrated to museum archival standard color science."
              delay={0.3}
            />
          </div>

          <div className="text-center my-5">
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
              CLIENT INQUIRIES
            </span>
            <h3 className="fw-bold" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h3>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className="mb-3 border-0 bg-transparent">
                  <Accordion.Header className="custom-section-accordion">What services do you provide?</Accordion.Header>
                  <Accordion.Body style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-color)', marginLeft: '20px', background: 'var(--glass-bg)', borderRadius: '0 12px 12px 0' }}>
                    We provide wedding, portrait, event, nature, street, and fashion photography using top-tier prime lenses and medium format digital systems.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="mb-3 border-0 bg-transparent">
                  <Accordion.Header className="custom-section-accordion">How can I book a session?</Accordion.Header>
                  <Accordion.Body style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-color)', marginLeft: '20px', background: 'var(--glass-bg)', borderRadius: '0 12px 12px 0' }}>
                    You can book a session directly through our Order section below or contact us via email/phone for bespoke schedules.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="mb-3 border-0 bg-transparent">
                  <Accordion.Header className="custom-section-accordion">Do you offer prints and albums?</Accordion.Header>
                  <Accordion.Body style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-color)', marginLeft: '20px', background: 'var(--glass-bg)', borderRadius: '0 12px 12px 0' }}>
                    Yes! You can order museum-grade archival prints, fine art canvas, and custom leather albums directly through your private client gallery.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .custom-section-accordion .accordion-button {
          background-color: var(--glass-bg) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 14px !important;
          box-shadow: none !important;
          padding: 16px 20px !important;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .custom-section-accordion .accordion-button:not(.collapsed) {
          color: var(--accent-color) !important;
          border-color: rgba(181, 98, 46, 0.4) !important;
          background-color: var(--surface-hover) !important;
        }
        [data-theme="dark"] .custom-section-accordion .accordion-button::after {
          filter: invert(0.8);
        }
        [data-theme="light"] .custom-section-accordion .accordion-button::after {
          filter: invert(0.2);
        }
      `}</style>
    </section>
  );
}

