import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUser, FaInfoCircle, FaCheckCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const StepForm = ({ 
  step, 
  setStep, 
  form, 
  setForm, 
  categories, 
  categoriesLoading,
  packages, 
  handleSubmit,
  isSubmitting 
}) => {
  const steps = [
    { title: 'Service', icon: <FaCamera /> },
    { title: 'Package', icon: <FaInfoCircle /> },
    { title: 'Details', icon: <FaUser /> }
  ];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const [[page, direction], setPage] = React.useState([0, 0]);

  // Sync internal page state when step is changed externally (e.g. pre-fill from URL)
  const prevStepRef = React.useRef(step);
  React.useEffect(() => {
    if (step !== prevStepRef.current) {
      setPage([step - 1, step > prevStepRef.current ? 1 : -1]);
      prevStepRef.current = step;
    }
  }, [step]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
    setStep(step + newDirection);
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-between mb-5 px-4 position-relative">
      <div className="position-absolute w-100" style={{ top: '20px', left: 0, height: '2px', background: 'var(--border-color)', zIndex: 0 }} />
      {steps.map((s, i) => (
        <div key={i} className="text-center position-relative" style={{ zIndex: 1 }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: step >= i + 1 ? 'var(--accent-color)' : 'var(--surface-color)',
              color: step >= i + 1 ? '#FBF7F2' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              transition: 'all 0.3s ease',
              border: step === i + 1 ? '2px solid white' : 'none'
            }}
          >
            {step > i + 1 ? <FaCheckCircle /> : s.icon}
          </div>
          <span style={{ fontSize: '0.8rem', color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {s.title}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="step-form-container">
      {renderStepIndicator()}

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {step === 1 && (
            <div className="step-1">
              <h4 className="mb-4 text-center">What are we capturing?</h4>
              {categoriesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border mb-3" style={{ color: 'var(--accent-color)' }} role="status" />
                  <p style={{ color: 'var(--text-secondary)' }}>Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-5">
                  <p style={{ color: 'var(--text-secondary)' }}>No categories found. Please try again later.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="col-md-4 col-6">
                      <div 
                        className={`card h-100 text-center p-3 cursor-pointer ${form.categoryId === cat.id ? 'selected-card' : ''}`}
                        onClick={() => setForm({ ...form, categoryId: cat.id })}
                        style={{
                          borderColor: form.categoryId === cat.id ? 'var(--accent-color)' : 'var(--border-color)',
                          background: form.categoryId === cat.id ? 'rgba(181, 98, 46, 0.1)' : 'var(--glass-bg)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '10px' }}>
                          <FaCamera />
                        </div>
                        <h6 style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{cat.name}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-2">
              <h4 className="mb-4 text-center">Choose your package</h4>
              <div className="row g-3">
                {['Basic', 'Standard', 'Premium'].map((pkg) => (
                  <div key={pkg} className="col-md-4">
                    <div 
                      className={`card h-100 p-4 cursor-pointer ${form.packageType === pkg.toLowerCase() ? 'selected-card' : ''}`}
                      onClick={() => setForm({ ...form, packageType: pkg.toLowerCase() })}
                      style={{
                        borderColor: form.packageType === pkg.toLowerCase() ? 'var(--accent-color)' : 'var(--border-color)',
                        background: form.packageType === pkg.toLowerCase() ? 'rgba(181, 98, 46, 0.1)' : 'var(--glass-bg)',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">{pkg}</h5>
                        {pkg === 'Standard' && <span className="badge bg-warning text-dark">Popular</span>}
                      </div>
                      <p className="small text-muted mb-0">Starting from</p>
                      <h4 className="text-primary mb-3">LKR 25,000</h4>
                      <ul className="list-unstyled small">
                        <li><FaCheckCircle className="text-success me-2" /> 2 Hour Session</li>
                        <li><FaCheckCircle className="text-success me-2" /> 10 Edited Photos</li>
                        <li><FaCheckCircle className="text-success me-2" /> Digital Delivery</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-3">
              <h4 className="mb-3 text-center">Your Details</h4>

              {/* Booking Summary Banner — shown when pre-filled from package page */}
              {(form.categoryId || form.packageType) && (
                <div className="booking-summary-banner mb-4 p-3 rounded-3 d-flex align-items-center gap-3" style={{
                  background: 'rgba(181, 98, 46, 0.08)',
                  border: '1px solid rgba(181, 98, 46, 0.35)',
                }}>
                  <div style={{ fontSize: '1.6rem', color: 'var(--accent-color)' }}>📋</div>
                  <div>
                    <div className="small fw-bold" style={{ color: 'var(--accent-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>Your Selection</div>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {form.categoryId && categories && categories.length > 0 && (() => {
                        const cat = categories.find(c => c.id === form.categoryId || c.id === parseInt(form.categoryId));
                        return cat ? (
                          <span className="badge rounded-pill px-3 py-2" style={{ background: 'var(--accent-color)', color: 'white', fontSize: '0.8rem' }}>
                            📷 {cat.name}
                          </span>
                        ) : null;
                      })()}
                      {form.packageType && (
                        <span className="badge rounded-pill px-3 py-2" style={{ background: 'var(--surface-color)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                          ⭐ {form.packageType.charAt(0).toUpperCase() + form.packageType.slice(1)} Package
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                    <label htmlFor="name">Full Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                    <label htmlFor="email">Email Address</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="phone" 
                      name="phone"
                      placeholder="+94"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input 
                      type="date" 
                      className="form-control" 
                      id="date"
                      name="eventDate"
                      value={form.eventDate}
                      onChange={(e) => setForm({...form, eventDate: e.target.value})}
                      required
                    />
                    <label htmlFor="date">Event Date</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea 
                      className="form-control" 
                      placeholder="Leave a message here" 
                      id="message" 
                      name="message"
                      style={{ height: '100px' }}
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                    ></textarea>
                    <label htmlFor="message">Special Requests</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="d-flex justify-content-between mt-5 pt-3 border-top border-secondary">
        <button 
          className="btn btn-outline-light d-flex align-items-center" 
          onClick={() => paginate(-1)}
          disabled={step === 1}
        >
          <FaChevronLeft className="me-2" /> Back
        </button>
        {step < 3 ? (
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={() => paginate(1)}
            disabled={step === 1 ? (categoriesLoading || !form.categoryId) : step === 2 ? !form.packageType : false}
          >
            Next <FaChevronRight className="ms-2" />
          </button>
        ) : (
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={handleSubmit}
            disabled={isSubmitting || !form.name || !form.email || !form.eventDate}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'} <FaCheckCircle className="ms-2" />
          </button>
        )}
      </div>


      <style>{`
        .selected-card {
          box-shadow: 0 0 20px rgba(181, 98, 46, 0.3) !important;
          transform: translateY(-5px);
        }
        .form-floating label {
          color: var(--text-secondary);
        }
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default StepForm;
