import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "../components/Lightbox";
import useTilt from "../hooks/useTilt";

const PriceCard = ({ tier, price, pkgName, id, navigate }) => {
  const { tiltProps } = useTilt({ maxRotation: 8 });
  return (
    <div className="col-lg-4 mb-4">
      <motion.div 
        {...tiltProps}
        className="card h-100 shadow-lg border-0 p-4 text-center tier-card"
        style={{ 
          ...tiltProps.style,
          borderRadius: '30px', 
          background: 'var(--surface-color)',
          border: tier === 'Standard' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)'
        }}
      >
        {tier === 'Standard' && <span className="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle px-3 py-2 rounded-pill">MOST POPULAR</span>}
        <h4 className="fw-bold mb-3 mt-2" style={{ color: tier === 'Standard' ? 'var(--accent-color)' : 'var(--text-primary)' }}>{tier}</h4>
        <h2 className="display-4 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>{price}</h2>
        <ul className="list-unstyled mb-5 text-secondary text-start ps-3">
          <li className="mb-2">✓ {tier === 'Basic' ? '2' : tier === 'Standard' ? '4' : '8'} Hours Coverage</li>
          <li className="mb-2">✓ {tier === 'Basic' ? '20' : tier === 'Standard' ? '50' : 'Unlimited'} Edited Photos</li>
          <li className="mb-2">✓ Digital Delivery</li>
          <li className="mb-2">✓ {tier !== 'Basic' ? 'Physical Print Bundle' : 'Standard Editing'}</li>
        </ul>
        <button 
          className={`btn btn-${tier === 'Standard' ? 'primary' : 'outline-primary'} btn-lg rounded-pill w-100 py-3 mt-auto fw-bold`}
          onClick={() => navigate(`/order?category=${encodeURIComponent(pkgName)}&type=${tier.toLowerCase()}`)}
        >
          BOOK {tier.toUpperCase()}
        </button>
      </motion.div>
    </div>
  );
};

export default function PackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currency, setCurrency] = useState('$');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/gallery/categories/${id}`);
        setPkg(res.data);
        if (res.data.images) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.error("Error fetching category", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();

    // Fetch currency symbol from settings
    axios.get('http://localhost:8080/api/settings')
      .then(res => { if (res.data?.currency) setCurrency(res.data.currency); })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">Loading...</div>;
  }

  if (!pkg) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="text-center">
        <h2 className="text-accent mb-3" style={{ color: "var(--accent-color)" }}>PACKAGE NOT FOUND</h2>
        <button className="btn btn-outline-primary" onClick={() => navigate('/home#gallery')}>Back to Home</button>
      </div>
    </div>
  );

  const getTierImages = (tierName) => {
    const tierImages = images.filter(img => img.packageType === tierName);
    const displayImages = [...tierImages];
    while (displayImages.length < 4) {
      displayImages.push({ isPlaceholder: true, id: `placeholder-${tierName}-${displayImages.length}` });
    }
    return displayImages.map((img, i) => 
      img.isPlaceholder ? `https://loremflickr.com/1200/800/${pkg.name.split(' ')[0].toLowerCase()}?random=${tierName}-${i}` : `http://localhost:8080/uploads/${img.imageUrl}`
    );
  };

  const basicImages = getTierImages('Basic');
  const standardImages = getTierImages('Medium');
  const premiumImages = getTierImages('Premium');
  const allImageUrls = [...basicImages, ...standardImages, ...premiumImages];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const basicPrice = pkg.basicPrice > 0 ? `${currency}${pkg.basicPrice}` : `${currency}800`;
  const standardPrice = pkg.mediumPrice > 0 ? `${currency}${pkg.mediumPrice}` : `${currency}1500`;
  const premiumPrice = pkg.premiumPrice > 0 ? `${currency}${pkg.premiumPrice}` : `${currency}3000`;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "var(--bg-color)" }}>
      <Navbar />
      <div className="container" style={{ marginTop: "150px", marginBottom: "80px" }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row mb-5 align-items-center text-center"
        >
          <div className="col-12">
            <h1 className="display-3 fw-bold mb-3" style={{ color: "var(--text-primary)" }}>{pkg.name}</h1>
            <p className="lead fs-4 mx-auto" style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>{pkg.description || 'Premium photography packages designed to capture your perfect moments.'}</p>
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="row mb-5 pb-5">
          <PriceCard tier="Basic" price={basicPrice} pkgName={pkg.name} id={id} navigate={navigate} />
          <PriceCard tier="Standard" price={standardPrice} pkgName={pkg.name} id={id} navigate={navigate} />
          <PriceCard tier="Premium" price={premiumPrice} pkgName={pkg.name} id={id} navigate={navigate} />
        </div>

        {/* Sample Gallery grouped by tier */}
        <div className="gallery-section mt-5">
          {[{name: 'Basic', urls: basicImages}, {name: 'Standard', urls: standardImages}, {name: 'Premium', urls: premiumImages}].map((tierData, tierIdx) => (
            <div key={tierData.name} className="mb-5">
              <h4 className="mb-4 d-flex align-items-center gap-3" style={{ color: "var(--accent-color)", letterSpacing: "2px" }}>
                <span className="h2 fw-bold mb-0">{tierData.name.toUpperCase()}</span> 
                <span className="small text-secondary fw-normal">SAMPLES</span>
                <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
              </h4>
              <div className="row g-4">
                {tierData.urls.map((url, i) => (
                  <div className="col-md-6 col-lg-3 mb-2" key={i} data-aos="zoom-in" data-aos-delay={i * 50}>
                    <motion.div 
                      className="gallery-item-container cursor-pointer overflow-hidden shadow-lg" 
                      style={{ borderRadius: '20px', background: "var(--surface-color)", height: '250px' }}
                      whileHover={{ scale: 0.98 }}
                      onClick={() => openLightbox(tierIdx * 4 + i)}
                    >
                      <motion.img 
                        initial={{ filter: "blur(10px)", scale: 1.1 }}
                        whileInView={{ filter: "blur(0px)", scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        src={url} 
                        alt={`${tierData.name} Sample ${i+1}`}
                        className="w-100 h-100 gallery-image"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div className="image-overlay d-flex align-items-center justify-content-center">
                        <span className="btn btn-outline-light btn-sm rounded-pill px-4">VIEW IMAGE</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox 
        images={allImageUrls}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((currentIndex - 1 + allImageUrls.length) % allImageUrls.length)}
        onNext={() => setCurrentIndex((currentIndex + 1) % allImageUrls.length)}
      />

      <Footer />

      <style>{`
        .tier-card { transition: all 0.4s ease; position: relative; overflow: visible; }
        .tier-card:hover { transform: translateY(-10px); }
        .gallery-item-container { position: relative; cursor: pointer; }
        .gallery-image { transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) !important; }
        .gallery-item-container:hover .gallery-image { transform: scale(1.1) !important; }
        .image-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(43, 31, 23, 0.4);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .gallery-item-container:hover .image-overlay { opacity: 1; }
      `}</style>
    </div>
  );
}


