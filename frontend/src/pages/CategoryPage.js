import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion } from "framer-motion";
import Lightbox from "../components/Lightbox";
import useTilt from "../hooks/useTilt";

const PhotoTiltCard = ({ img, tier, index, onClick }) => {
  const { tiltProps } = useTilt({ maxRotation: 12, scale: 1.04 });
  return (
    <div className="col-md-6 col-lg-3 mb-3" data-aos="zoom-in" data-aos-delay={index * 50}>
      <motion.div 
        {...tiltProps}
        className="gallery-item-container cursor-pointer overflow-hidden shadow-lg" 
        style={{ 
          ...tiltProps.style,
          borderRadius: '20px', 
          background: "var(--surface-color)", 
          height: '240px', 
          position: 'relative',
          border: '1px solid var(--border-color)',
          boxShadow: '0 15px 30px rgba(0,0,0,0.25)'
        }}
        onClick={onClick}
      >
        <motion.img 
          initial={{ filter: "blur(8px)", scale: 1.05 }}
          whileInView={{ filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          src={img} 
          alt={`${tier} Portfolio ${index + 1}`}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
        <div className="image-overlay d-flex flex-column align-items-center justify-content-center" style={{ transform: 'translateZ(20px)' }}>
          <span className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow">
            VIEW PHOTO
          </span>
        </div>
        <div className="hover-glow" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 255, 255, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </motion.div>
    </div>
  );
};

const CategoryTierGallery = ({ tier, images, startIndex, openLightbox }) => (
  <div className="mb-5">
    <h4 className="mb-4 d-flex align-items-center gap-3" style={{ color: "var(--accent-color)", letterSpacing: "2px" }}>
      <span className="h3 fw-bold mb-0">{tier.toUpperCase()}</span> 
      <span className="small text-secondary fw-normal">PORTFOLIO</span>
      <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
    </h4>
    <div className="row g-4">
      {images.map((img, i) => (
        <PhotoTiltCard
          key={i}
          img={img}
          tier={tier}
          index={i}
          onClick={() => openLightbox(startIndex + i)}
        />
      ))}
    </div>
  </div>
);

const PackageTierCard = ({ pkg, category, categoryId, navigate }) => {
  const { tiltProps } = useTilt({ maxRotation: 10, scale: 1.03 });
  
  return (
    <div className="col-md-4 mb-4">
      <motion.div 
        {...tiltProps}
        className="card h-100 shadow-lg p-5 text-center border-0 package-select-card" 
        style={{ 
          ...tiltProps.style,
          borderRadius: '40px',
          background: 'var(--surface-color)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          border: pkg.name === 'Standard' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
          boxShadow: pkg.name === 'Standard' ? '0 25px 60px rgba(181, 98, 46, 0.25)' : '0 20px 45px rgba(0,0,0,0.2)'
        }}
      >
        {pkg.name === "Standard" && (
          <div className="position-absolute top-0 start-50 translate-middle-x mt-4" style={{ transform: 'translateZ(35px)' }}>
            <span className="badge rounded-pill bg-warning text-dark px-3 py-2 fw-bold shadow">MOST POPULAR</span>
          </div>
        )}
        
        <h4 className="fw-bold mb-3 mt-3" style={{ transform: 'translateZ(25px)' }}>{pkg.name}</h4>
        <div className="display-4 fw-bold mb-4" style={{ color: "var(--accent-color)", transform: 'translateZ(30px)' }}>{pkg.price}</div>
        <p className="mb-5 text-secondary small" style={{ transform: 'translateZ(15px)' }}>{pkg.details}</p>
        
        <div className="mt-auto" style={{ transform: 'translateZ(28px)' }}>
          <button
            className="btn btn-primary btn-lg w-100 rounded-pill shadow-lg py-3 fw-bold"
            onClick={() =>
              navigate(
                `/order?category=${category.toLowerCase()}&type=${pkg.value.toLowerCase()}&categoryId=${categoryId}`
              )
            }
          >
            BOOK {pkg.name.toUpperCase()}
          </button>
        </div>

        <div className="hover-glow" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(181, 98, 46, 0.18) 0%, transparent 75%)',
          pointerEvents: 'none'
        }} />
      </motion.div>
    </div>
  );
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState({
    currency: "$",
    basicPrice: "250",
    standardPrice: "550",
    premiumPrice: "950"
  });

  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    axios.get("https://dd-photography-95.onrender.com/api/settings")
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error("Error fetching settings:", err));

    axios.get("https://dd-photography-95.onrender.com/api/categories")
      .then(res => setCategoriesList(res.data))
      .catch(err => console.error("Error fetching categories:", err));

    axios.get("https://dd-photography-95.onrender.com/api/gallery/categories")
      .then(res => {
        const found = res.data.find(c => c.name.toLowerCase() === category.toLowerCase());
        if (found) {
          setCategoryData(found);
          if (found.images) {
            setGalleryImages(found.images);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching gallery images:", err);
        setLoading(false);
      });
  }, [category]);

  const currencySymbol = settings.currency || "$";
  const packageTypes = [
    { id: 1, name: "Basic", value: "basic", price: `${currencySymbol}${settings.basicPrice || "250"}`, details: "Essential coverage for short sessions" },
    { id: 2, name: "Standard", value: "standard", price: `${currencySymbol}${settings.standardPrice || "550"}`, details: "The perfect balance for most clients" },
    { id: 3, name: "Premium", value: "premium", price: `${currencySymbol}${settings.premiumPrice || "950"}`, details: "Unlimited creativity and full delivery" },
  ];

  const defaultCategoryImages = [
    "https://loremflickr.com/1200/800/photography,1", "https://loremflickr.com/1200/800/photography,2",
    "https://loremflickr.com/1200/800/photography,3", "https://loremflickr.com/1200/800/photography,4",
    "https://loremflickr.com/1200/800/photography,5", "https://loremflickr.com/1200/800/photography,6",
    "https://loremflickr.com/1200/800/photography,7", "https://loremflickr.com/1200/800/photography,8",
    "https://loremflickr.com/1200/800/photography,9", "https://loremflickr.com/1200/800/photography,10",
    "https://loremflickr.com/1200/800/photography,11", "https://loremflickr.com/1200/800/photography,12",
  ];

  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const matchedBookingCategory = categoriesList.find(
    c => c.name.toLowerCase() === category.toLowerCase()
  );

  // Build 4 images per package tier
  const tiersConfig = [
    { tier: "Basic", label: "BASIC" },
    { tier: "Medium", label: "STANDARD" },
    { tier: "Premium", label: "PREMIUM" }
  ];

  const allTierImages = tiersConfig.map(({ tier }, idx) => {
    const tierImgs = galleryImages
      .filter(
        (img) =>
          img.packageType?.toLowerCase() === tier.toLowerCase() ||
          (tier === "Medium" && img.packageType?.toLowerCase() === "standard")
      )
      .sort((a, b) => (a.slotNumber || 0) - (b.slotNumber || 0));

    const formatted = tierImgs.map((img) =>
      img.imageUrl.startsWith("http") ? img.imageUrl : `https://dd-photography-95.onrender.com/uploads/${img.imageUrl}`
    );

    while (formatted.length < 4) {
      formatted.push(defaultCategoryImages[idx * 4 + formatted.length]);
    }

    return formatted;
  });

  const fullLightboxList = allTierImages.flat();

  const categoryId = matchedBookingCategory?.id;

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-center p-5">
       <div className="spinner-border mb-4" style={{ color: "var(--accent-color)", width: "3rem", height: "3rem" }} role="status"></div>
       <h3 style={{ color: "var(--accent-color)", letterSpacing: "2px" }}>Gathering visual excellence...</h3>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "150px", marginBottom: "80px" }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="fw-bold display-3 mb-2" style={{ color: "var(--text-primary)" }}>
            {displayCategory} <span style={{ color: "var(--accent-color)" }}>SESSIONS</span>
          </h1>
          {categoryData?.description && (
            <p className="lead text-secondary mx-auto" style={{ maxWidth: "700px" }}>
              {categoryData.description}
            </p>
          )}
        </motion.div>

        {/* Packages First */}
        <div className="row justify-content-center mb-5 pb-5">
          {packageTypes.map((pkg) => (
            <PackageTierCard 
              key={pkg.id} 
              pkg={pkg} 
              category={category} 
              categoryId={categoryId} 
              navigate={navigate} 
            />
          ))}
        </div>

        {/* Grouped Gallery - 4 Images per Package Tier */}
        <div className="gallery-tiers mt-5">
          {tiersConfig.map(({ tier, label }, idx) => (
            <CategoryTierGallery 
              key={tier}
              tier={label}
              images={allTierImages[idx]}
              startIndex={idx * 4}
              openLightbox={(i) => { setCurrentIndex(i); setLightboxOpen(true); }}
            />
          ))}
        </div>
      </div>

      <Lightbox 
        images={fullLightboxList}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((currentIndex - 1 + fullLightboxList.length) % fullLightboxList.length)}
        onNext={() => setCurrentIndex((currentIndex + 1) % fullLightboxList.length)}
      />

      <Footer />
      <style>{`
        .package-select-card:hover { background: var(--gradient-gold) !important; }
        .package-select-card:hover * { color: #FBF7F2 !important; }
        .package-select-card:hover .btn-primary { background: #FBF7F2 !important; color: var(--accent-color) !important; border: none; }
        .gallery-item-container:hover .image-overlay { opacity: 1; }
        .image-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(43, 31, 23, 0.5); opacity: 0; transition: opacity 0.3s;
        }
      `}</style>
    </>
  );
}


