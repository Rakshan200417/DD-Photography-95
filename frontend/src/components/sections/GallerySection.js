import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import useTilt from "../../hooks/useTilt";
import { FaArrowRight } from "react-icons/fa";

const SectionPackageCard = ({ pkg, index, navigate }) => {
  const { tiltProps } = useTilt({ maxRotation: 8 });
  const imageUrl = pkg.coverImage
    ? `https://dd-photography-95.onrender.com/uploads/${pkg.coverImage}`
    : null;

  return (
    <motion.div 
      className="col-md-6 col-lg-4 mb-4"
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        {...tiltProps}
        className="package-card"
        style={{ 
          ...tiltProps.style,
          cursor: "pointer", 
          borderRadius: '24px', 
          overflow: 'hidden',
          position: 'relative',
          minHeight: '340px',
          border: '1px solid rgba(181, 98, 46, 0.25)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          background: '#1a1510',  // Always dark so text is always visible
        }}
        whileHover={{
          y: -8,
          borderColor: 'rgba(181, 98, 46, 0.7)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(181, 98, 46, 0.3)'
        }}
        onClick={() => navigate(`/package/${pkg.id}`)}
      >
        {/* Actual image — rendered as an <img> so browser loads it reliably */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={pkg.name}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              zIndex: 0,
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}

        {/* Gradient scrim — always present for text readability */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(10,7,5,0.96) 0%, rgba(10,7,5,0.55) 45%, rgba(10,7,5,0.15) 100%)',
          zIndex: 1,
          borderRadius: '24px',
        }} />

        {/* Content pinned to bottom */}
        <div className="card-body d-flex flex-column justify-content-end p-4 position-relative" style={{ zIndex: 2, height: '100%', minHeight: '340px' }}>
          <h5 className="fw-bold mb-2" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{pkg.name}</h5>
          
          <div className="tier-indicator mb-2 d-flex flex-wrap gap-1">
            {pkg.basicPrice > 0 && <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>BASIC</span>}
            {pkg.mediumPrice > 0 && <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>STANDARD</span>}
            {pkg.premiumPrice > 0 && <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>PREMIUM</span>}
            {!(pkg.basicPrice > 0) && !(pkg.mediumPrice > 0) && !(pkg.premiumPrice > 0) && (
              <>
                <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>BASIC</span>
                <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>STANDARD</span>
                <span className="badge rounded-pill" style={{ background: 'rgba(181, 98, 46, 0.3)', color: '#f5d0a5', fontSize: '0.62rem', border: '1px solid rgba(181, 98, 46, 0.6)' }}>PREMIUM</span>
              </>
            )}
          </div>

          <p className="small mb-3" style={{ color: 'rgba(240,220,200,0.8)', lineHeight: '1.5', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{pkg.description || 'Premium photography packages designed to capture your perfect moments.'}</p>
          
          <button className="btn btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold" style={{ background: 'rgba(181, 98, 46, 0.9)', color: 'white', border: 'none', backdropFilter: 'blur(4px)' }}>
            <span>View Tier Details</span>
            <FaArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default function GallerySection() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://dd-photography-95.onrender.com/api/gallery/categories");
        setPackages(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section id="gallery" className="py-5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center mb-5 fw-bold display-5" style={{ color: "var(--text-primary)" }}>
            Our Photography <span style={{ color: "var(--accent-color)" }}>Packages</span>
          </h2>
          {loading ? (
            <div className="text-center text-muted">Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="text-center text-muted">No photography packages available at the moment.</div>
          ) : (
            <div className="row">
              {packages.map((pkg, index) => (
                <SectionPackageCard key={pkg.id} pkg={pkg} index={index} navigate={navigate} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <style>{`
        .package-card:hover .hover-glow { opacity: 1; }
      `}</style>
    </section>
  );
}


