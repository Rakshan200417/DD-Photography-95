import { FaFacebookF, FaInstagram, FaTiktok, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-4 mt-auto" style={{ background: "var(--surface-color)", borderTop: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
      <div className="container">
        <div className="row align-items-center justify-content-between g-4">
          
          {/* Brand & Nav */}
          <div className="col-12 col-md-auto d-flex flex-column flex-md-row align-items-center gap-4">
            <h3 className="fw-bold mb-0" style={{ color: "var(--accent-color)", letterSpacing: "1px" }}>DD PHOTOGRAPHY 95</h3>
            
            <div className="d-none d-md-block" style={{ width: "2px", height: "40px", backgroundColor: "var(--border-color)" }}></div>
            
            <nav className="d-flex gap-4 fw-semibold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
              <a href="/" className="footer-link text-decoration-none">Home</a>
              <a href="/home#gallery" className="footer-link text-decoration-none">Gallery</a>
              <a href="/about" className="footer-link text-decoration-none">About</a>
              <a href="/contact" className="footer-link text-decoration-none">Contact</a>
            </nav>
          </div>

          {/* Socials & Contact */}
          <div className="col-12 col-md-auto text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-2">
              <a href="https://www.facebook.com/share/1ZaXPTDGWV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook"><FaFacebookF /></a>
              <a href="https://www.instagram.com/_dd_photography_95_?stkn=amYyZTRwYm05ZGZ6" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@_dd_photography_95_?_r=1&_t=ZS-99kqLqqAXiv" target="_blank" rel="noopener noreferrer" className="social-icon" title="TikTok"><FaTiktok /></a>
              <a href="mailto:Dhilshanmohamed2002@gmail.com" className="social-icon" title="Email Us"><FaEnvelope /></a>
              <a href="https://maps.app.goo.gl/K5oNSTxuWZYkGvqa8?g_st=ic" target="_blank" rel="noopener noreferrer" className="social-icon" title="Location"><FaMapMarkerAlt /></a>
            </div>
            <div className="fw-bold d-flex align-items-center justify-content-center justify-content-md-end gap-2" style={{ color: "var(--text-secondary)", letterSpacing: "1px", fontSize: "0.95rem" }}>
              <FaPhoneAlt size={12} className="text-accent" />
              <span>+94 75 518 9759</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "var(--border-color) !important", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          © {new Date().getFullYear()} DD Photography 95. All rights reserved.
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-primary);
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: var(--accent-color);
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-color);
          color: var(--text-primary);
          transition: all 0.3s ease;
          text-decoration: none;
          border: 1px solid var(--border-color);
        }
        .social-icon:hover {
          background-color: var(--accent-color);
          color: white;
          transform: translateY(-2px);
          border-color: var(--accent-color);
        }
        .text-accent {
          color: var(--accent-color);
        }
      `}</style>
    </footer>
  );
}
