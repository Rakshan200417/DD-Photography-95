import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Accordion from 'react-bootstrap/Accordion';
import { motion } from "framer-motion";
import useCountUp from "../hooks/useCountUp";
import { FaChevronDown } from "react-icons/fa";

const StatItem = ({ end, label }) => {
  const { count, elementRef } = useCountUp(end);
  return (
    <div className="col-md-4 text-center mb-4" ref={elementRef}>
      <h2 className="display-4 fw-bold" style={{ color: "var(--accent-color)" }}>{count}+</h2>
      <p className="text-secondary text-uppercase ls-2">{label}</p>
    </div>
  );
};

const RevealText = ({ text }) => {
  const words = text.split(" ");
  return (
    <p className="lead mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          style={{ display: "inline-block", marginRight: "5px" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

export default function AboutFAQ() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "150px", marginBottom: "100px" }}>
        {/* About Section */}
        <section className="row align-items-center mb-5 pb-5">
          <div className="col-lg-7" data-aos="fade-right">
            <h2 className="display-3 fw-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Our <span style={{ color: "var(--accent-color)" }}>Story</span>
            </h2>
            <RevealText text="DD Photography is your premier photography service, capturing moments that last forever. From weddings to portraits, we bring your memories to life with creativity and style." />
            <RevealText text="We believe every frame tells a story, and our mission is to make yours unforgettable. With over half a decade of experience, we've mastered the art of lighting, composition, and emotion." />
          </div>
          <div className="col-lg-5 d-none d-lg-block text-end" data-aos="fade-left">
            <span style={{ 
              fontSize: "15rem", 
              fontWeight: "900", 
              color: "rgba(181, 98, 46, 0.05)",
              lineHeight: "1",
              userSelect: "none"
            }}>
              95
            </span>
          </div>
        </section>

        {/* Stats Section */}
        <section className="row my-5 py-5 border-top border-bottom border-secondary">
          <StatItem end={500} label="Sessions Completed" />
          <StatItem end={200} label="Happy Clients" />
          <StatItem end={5} label="Years Experience" />
        </section>

        {/* FAQ Section */}
        <section className="mt-5 pt-5">
          <h2 className="text-center mb-5 fw-bold display-4" data-aos="fade-up">
            Common <span style={{ color: "var(--accent-color)" }}>Questions</span>
          </h2>
          <div className="mx-auto" style={{ maxWidth: "800px" }}>
            <Accordion defaultActiveKey="0">
              {[
                { q: "What services do you provide?", a: "We provide wedding, portrait, event, nature, street, and fashion photography." },
                { q: "How can I book a session?", a: "You can book a session directly through our Order page or contact us via email/phone." },
                { q: "Do you offer prints?", a: "Yes! You can order prints of your favorite photos when you receive the gallery." }
              ].map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Accordion.Item eventKey={i.toString()} className="mb-3 border-0 bg-transparent">
                    <Accordion.Header className="custom-accordion-header">
                      {faq.q}
                    </Accordion.Header>
                    <Accordion.Body style={{ color: "var(--text-secondary)", borderLeft: "2px solid var(--accent-color)", marginLeft: "20px" }}>
                      {faq.a}
                    </Accordion.Body>
                  </Accordion.Item>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
      <Footer />

      <style>{`
        .ls-2 { letter-spacing: 2px; }
        .custom-accordion-header .accordion-button {
          background-color: var(--surface-color) !important;
          color: var(--text-primary) !important;
          border-radius: 15px !important;
          box-shadow: none !important;
          padding: 20px 25px;
        }
        .custom-accordion-header .accordion-button:not(.collapsed) {
          color: var(--accent-color) !important;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .custom-accordion-header .accordion-button::after {
          filter: brightness(0) invert(1);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-accordion-header .accordion-button:not(.collapsed)::after {
          filter: sepia(1) saturate(5) hue-rotate(10deg);
        }
      `}</style>
    </>
  );
}

