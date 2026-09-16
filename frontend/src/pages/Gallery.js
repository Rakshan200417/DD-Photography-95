import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useTilt from "../hooks/useTilt";
import { FaArrowRight } from "react-icons/fa";

const PackageCard = ({ pkg, index, navigate }) => {
  const { tiltProps } = useTilt({ maxRotation: 10 });

  return (
    <div
      className="col-md-6 col-lg-4 mb-4"
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 100}
    >
      <motion.div 
        {...tiltProps}
        className="card shadow-sm border-0 h-100 package-card" 
        style={{ 
          ...tiltProps.style,
          cursor: "pointer", 
          borderRadius: '20px', 
          backgroundColor: 'var(--surface-color)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={() => navigate(`/package/${pkg.id}`)}
      >
        <div className="card-body d-flex flex-column text-center p-5 position-relative" style={{ zIndex: 1 }}>
          <h4 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>{pkg.name}</h4>
          
          <p className="flex-grow-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{pkg.desc}</p>
          
          <div className="tier-indicator mb-4 d-flex justify-content-center gap-2">
            <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.1)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}>BASIC</span>
            <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.1)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}>STANDARD</span>
            <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.1)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}>PREMIUM</span>
          </div>

          <motion.button 
            className="btn btn-outline-primary mt-auto rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 py-3"
            whileHover={{ gap: '15px' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/order?category=${encodeURIComponent(pkg.name)}`);
            }}
          >
            Book Now <FaArrowRight />
          </motion.button>
        </div>

        {/* Hover Glow Effect */}
        <div className="hover-glow" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(181, 98, 46, 0.15) 0%, transparent 80%)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s'
        }} />
      </motion.div>

      <style>{`
        .package-card:hover .hover-glow {
          opacity: 1;
        }
        .package-card:hover {
          box-shadow: 0 15px 35px rgba(181, 98, 46, 0.2) !important;
          border: 1px solid var(--accent-color) !important;
        }
      `}</style>
    </div>
  );
};

export default function Gallery() {
  const navigate = useNavigate();

  const packages = [
    { id: 1, name: "Wedding Photography", desc: "Full day coverage with premium editing." },
    { id: 2, name: "Pre-Wedding Shoot", desc: "Outdoor shoot with 2 locations." },
    { id: 3, name: "Maternity Shoot", desc: "Studio or outdoor session." },
    { id: 4, name: "Newborn Photography", desc: "Comfortable studio session with props." },
    { id: 5, name: "Birthday Coverage", desc: "Candid and structured event coverage." },
    { id: 6, name: "Corporate Events", desc: "Professional event photography." },
    { id: 7, name: "Fashion Portfolio", desc: "Studio lighting and multiple outfit changes." },
    { id: 8, name: "Product Photography", desc: "High quality commercial shots." },
    { id: 9, name: "Real Estate", desc: "Wide angle and drone photography." },
    { id: 10, name: "Family Portraits", desc: "Beautiful memories with your loved ones." },
    { id: 11, name: "Sports Photography", desc: "Fast-action shots and athlete portraits." },
    { id: 12, name: "Travel Photography", desc: "Capturing the essence of your journeys." },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container my-5 flex-grow-1 pt-5">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5 fw-bold display-4" 
          style={{ color: 'var(--text-primary)', letterSpacing: '2px' }}
        >
          Our Photography <span style={{ color: 'var(--accent-color)' }}>Packages</span>
        </motion.h2>
        <div className="row">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} navigate={navigate} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}


