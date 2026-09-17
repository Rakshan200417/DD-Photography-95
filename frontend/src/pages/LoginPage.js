import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaCameraRetro, FaLock, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const [theme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Registration fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const googleBtnRef = useRef(null);

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '925800338782-3j71n7osp2n2j8ql9sni9p2pbrguuqp5.apps.googleusercontent.com';

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    try {
      setLoading(true);
      setError(null);

      // Extract client-side JWT payload safely for instant fallback
      let googleProfile = {};
      try {
        const base64Url = credentialResponse.credential.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          googleProfile = JSON.parse(jsonPayload);
        }
      } catch (jwtErr) {
        console.warn('JWT client-side decode notice:', jwtErr);
      }

      const res = await axios.post('https://dd-photography-95.onrender.com/api/auth/google', {
        idToken: credentialResponse.credential,
        email: googleProfile.email,
        name: googleProfile.name,
        picture: googleProfile.picture
      });

      if (res.data?.token) {
        if (res.data.role === 'ADMIN') {
          // Admin Google Sign-In: clear client credentials
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userPicture');
          localStorage.setItem('adminToken', res.data.token);
          localStorage.setItem('admin', res.data.username || 'Admin');
          localStorage.setItem('userRole', 'ADMIN');
          navigate('/admin');
        } else {
          // Customer / User Google Sign-In: clear admin credentials
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('username', res.data.username || '');
          localStorage.setItem('userEmail', res.data.email || '');
          localStorage.setItem('userRole', 'USER');
          if (res.data.picture) {
            localStorage.setItem('userPicture', res.data.picture);
          }
          try {
            localStorage.setItem('user', JSON.stringify({
              id: res.data.userId,
              username: res.data.username || '',
              email: res.data.email || ''
            }));
          } catch (err) {
            localStorage.setItem('user', String(res.data.userId));
          }
          window.location.href = '/home';
        }
      }
    } catch (err) {
      console.error('[GOOGLE AUTH ERROR]', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mount Google Identity Services button (single instance)
  useEffect(() => {
    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        try {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSuccess,
            auto_select: false
          });

          const screenWidth = window.innerWidth;
          const btnWidth = screenWidth < 400 ? 270 : 340;

          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            shape: 'pill',
            width: btnWidth,
            text: showRegister ? 'signup_with' : 'signin_with',
            logo_alignment: 'left'
          });
        } catch (e) {
          console.warn('[GOOGLE GSI] render error:', e);
        }
      }
    };

    renderGoogleBtn();

    const pollTimer = setInterval(() => {
      if (window.google?.accounts?.id && googleBtnRef.current && !googleBtnRef.current.hasChildNodes()) {
        renderGoogleBtn();
      }
    }, 250);

    return () => clearInterval(pollTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, showRegister]);

  useEffect(() => {
    let mounted = true;
    axios.get('https://dd-photography-95.onrender.com/api/users/all')
      .then(res => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data.map(u => u.email).filter(Boolean) : [];
        setEmails(list);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Unified submission: identifies whether account is Admin or regular User automatically
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('https://dd-photography-95.onrender.com/api/auth/login', {
        username: identifier,
        password
      });

      if (res.data?.token) {
        if (res.data.role === 'ADMIN') {
          // Authenticated as Administrator: clear client credentials
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userPicture');
          localStorage.setItem('adminToken', res.data.token);
          localStorage.setItem('admin', res.data.username);
          localStorage.setItem('userRole', 'ADMIN');
          navigate('/admin');
        } else {
          // Authenticated as Client / User: clear admin credentials
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('username', res.data.username || '');
          localStorage.setItem('userEmail', res.data.email || identifier);
          localStorage.setItem('userRole', 'USER');
          try {
            localStorage.setItem('user', JSON.stringify({
              id: res.data.userId,
              username: res.data.username || '',
              email: res.data.email || identifier
            }));
          } catch (err) {
            localStorage.setItem('user', String(res.data.userId));
          }
          window.location.href = '/home';
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('https://dd-photography-95.onrender.com/api/users/register', {
        username: regUsername,
        email: regEmail,
        password: regPassword
      });
      if (res.data?.userId) {
        // Auto-login after registration
        const login = await axios.post('https://dd-photography-95.onrender.com/api/auth/login', {
          username: regEmail,
          password: regPassword
        });
        if (login.data?.token) {
          // Always clear admin credentials on new user registration
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          localStorage.setItem('userToken', login.data.token);
          localStorage.setItem('userId', login.data.userId);
          localStorage.setItem('username', login.data.username || '');
          localStorage.setItem('userEmail', login.data.email || regEmail);
          localStorage.setItem('userRole', 'USER');
          try {
            localStorage.setItem('user', JSON.stringify({
              id: login.data.userId,
              username: login.data.username || '',
              email: login.data.email || regEmail
            }));
          } catch (err) {
            localStorage.setItem('user', String(login.data.userId));
          }
          window.location.href = '/home';
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emails.filter(e => e.toLowerCase().includes((identifier || '').toLowerCase()));

  return (
    <div
      className="position-relative login-page-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        padding: '20px',
        transition: 'background-color 0.3s ease'
      }}
    >


      <div
        className="login-container-card"
        style={{
          width: '100%',
          maxWidth: '1050px',
          minHeight: '620px',
          display: 'flex',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'var(--surface-color)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        {/* Left: Luxury Studio Presentation */}
        <div
          className="login-left d-none d-md-flex"
          style={{
            flex: '1 1 50%',
            background: 'linear-gradient(135deg, #F0EAE1 0%, #E3DACD 100%)',
            padding: '54px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--border-color)',
            position: 'relative',
            transition: 'background 0.3s ease'
          }}
        >
          <div>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(181, 98, 46, 0.15)',
                  border: '1px solid rgba(181, 98, 46, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaCameraRetro size={24} color="#B5622E" />
              </div>
              <div>
                <span className="badge rounded-pill px-3 py-1 login-studio-badge">
                  STUDIO PORTAL
                </span>
              </div>
            </div>

            <h1 className="login-left-title" style={{
              fontSize: '38px',
              margin: 0,
              fontWeight: 800,
              color: '#18181b',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}>
              DD Photography <span className="login-left-brand-num" style={{ color: '#B5622E', fontWeight: 900 }}>95</span>
            </h1>
            <p className="login-left-desc" style={{
              marginTop: '18px',
              fontSize: '1.05rem',
              color: '#2D3748',
              lineHeight: '1.7',
              transition: 'color 0.3s ease'
            }}>
              One unified portal for valued clients and studio administrators. Access your tailored portfolio, view booking orders, or manage studio galleries.
            </p>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(43, 31, 23, 0.15)' }}>
            <p className="small mb-0 login-left-notice" style={{ color: '#5A4E46', fontWeight: 500 }}>
              System automatically identifies Admin and Client privileges on login.
            </p>
          </div>
        </div>

        {/* Right: Unified Sign-in / Register form */}
        <div
          className="login-right-panel"
          style={{
            flex: '1 1 50%',
            background: 'var(--surface-color)',
            padding: '48px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div className="mb-4">
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                {showRegister ? 'Create Account' : (
                  <>
                    <span className="d-none d-md-inline">Welcome Back</span>
                    <span className="d-inline d-md-none">DD Photography 95</span>
                  </>
                )}
              </h3>
              <p className="small mt-1 mb-0" style={{ color: 'var(--text-secondary)' }}>
                {showRegister
                  ? 'Sign up to book sessions and receive private galleries'
                  : 'Enter your email or username to continue'}
              </p>
            </div>

            {!showRegister ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3" style={{ position: 'relative' }} ref={suggestionsRef}>
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                    Email or Username
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control login-form-input"
                      placeholder="Email or admin username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      required
                      style={{
                        paddingLeft: '38px',
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)',
                        borderRadius: '12px'
                      }}
                    />
                    <FaUser
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--accent-color)'
                      }}
                    />
                  </div>

                  {showSuggestions && filteredEmails.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '72px',
                        background: 'var(--surface-color)',
                        border: '1px solid var(--border-color)',
                        zIndex: 40,
                        borderRadius: 12,
                        maxHeight: 180,
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }}
                    >
                      {filteredEmails.map((em, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                          }}
                          onClick={() => {
                            setIdentifier(em);
                            setShowSuggestions(false);
                          }}
                        >
                          {em}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type="password"
                      className="form-control login-form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        paddingLeft: '38px',
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)',
                        borderRadius: '12px'
                      }}
                    />
                    <FaLock
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--accent-color)'
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger p-2 small mb-3 rounded-3" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold rounded-pill mb-3"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-control login-form-input"
                    placeholder="Your name"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control login-form-input"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>Password</label>
                  <input
                    type="password"
                    className="form-control login-form-input"
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger p-2 small mb-3 rounded-3" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold rounded-pill mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Single Unified Google Auth Section */}
            <div style={{ width: '100%' }}>
              <div className="d-flex align-items-center my-3" style={{ width: '100%' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span
                  className="px-3 small text-uppercase fw-semibold"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  or {showRegister ? 'sign up with' : 'continue with'}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <div
                className="d-flex justify-content-center mb-3"
                style={{ width: '100%', minHeight: '44px' }}
              >
                <div ref={googleBtnRef} style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }}></div>
              </div>
            </div>

            {/* Switch between Sign In and Register */}
            <div className="text-center mt-3">
              {!showRegister ? (
                <div>
                  <span className="small" style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(true);
                      setError(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-color)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Register here
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  ← Back to Sign In
                </button>
              )}
            </div>

            <div className="text-center mt-4">
              <Link to="/home" className="small text-decoration-none login-home-link" style={{ color: '#A1A1AA', fontWeight: 500 }}>
                Return to DD Photography Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
