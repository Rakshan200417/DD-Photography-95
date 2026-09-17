import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaShieldAlt,
  FaServer,
  FaCheckCircle,
  FaSlidersH,
  FaSave,
  FaEnvelope,
  FaEdit,
  FaPaperPlane,
  FaPhoneAlt,
  FaDatabase
} from "react-icons/fa";

export default function AdminSettings() {
  const [adminUsername, setAdminUsername] = useState("admin");
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [stats, setStats] = useState(null);

  // Settings state
  const [currency, setCurrency] = useState("$");
  const [basicPrice, setBasicPrice] = useState("250");
  const [standardPrice, setStandardPrice] = useState("550");
  const [premiumPrice, setPremiumPrice] = useState("950");
  const [studioEmail, setStudioEmail] = useState("ddphotography95@gmail.com");
  const [studioPhone, setStudioPhone] = useState("+94 77 123 4567");
  const [acceptingBookings, setAcceptingBookings] = useState(true);

  // Feedback messages
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userActionMsg, setUserActionMsg] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Admin Management state
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editAdminEmail, setEditAdminEmail] = useState("");

  // SMTP Test state
  const [testEmailAddress, setTestEmailAddress] = useState("dhilshanmohamed2002@gmail.com");
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // Currency presets
  const CURRENCY_PRESETS = [
    { label: "USD ($)", symbol: "$" },
    { label: "LKR (Rs.)", symbol: "Rs." },
    { label: "EUR (€)", symbol: "€" },
    { label: "GBP (£)", symbol: "£" },
    { label: "INR (₹)", symbol: "₹" },
    { label: "AUD (A$)", symbol: "A$" },
    { label: "CAD (C$)", symbol: "C$" },
  ];

  const fetchSettings = async () => {
    try {
      const res = await axios.get("https://dd-photography-95.onrender.com/api/settings");
      if (res.data) {
        setCurrency(res.data.currency || "$");
        setBasicPrice(res.data.basicPrice || "250");
        setStandardPrice(res.data.standardPrice || "550");
        setPremiumPrice(res.data.premiumPrice || "950");
        setStudioEmail(res.data.studioEmail || "ddphotography95@gmail.com");
        setStudioPhone(res.data.studioPhone || "+94 77 123 4567");
        setAcceptingBookings(res.data.acceptingBookings ?? true);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const res = await axios.get("https://dd-photography-95.onrender.com/api/auth/all");
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setAdminsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("https://dd-photography-95.onrender.com/api/admin/dashboard");
      setStats(res.data);
      setDbStatus("Connected (MySQL / MariaDB Online)");
    } catch {
      setDbStatus("Database Connection Error");
    }
  };

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) setAdminUsername(savedAdmin);

    fetchSettings();
    fetchAdmins();
    fetchDashboardStats();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);

    try {
      await axios.put("https://dd-photography-95.onrender.com/api/settings", {
        currency,
        basicPrice,
        standardPrice,
        premiumPrice,
        studioEmail,
        studioPhone,
        acceptingBookings
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert("Failed to save settings: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveAdminEmail = async (id) => {
    if (!editAdminEmail || !editAdminEmail.trim()) {
      alert("Email cannot be empty");
      return;
    }
    try {
      await axios.put(`https://dd-photography-95.onrender.com/api/auth/admins/${id}/email`, { email: editAdminEmail });
      setEditingAdminId(null);
      fetchAdmins();
      setUserActionMsg("Admin notification email updated successfully.");
      setTimeout(() => setUserActionMsg(null), 4000);
    } catch (err) {
      alert("Failed to update admin email: " + (err.response?.data?.error || err.message));
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.trim()) {
      alert("Please enter a destination email address.");
      return;
    }
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await axios.get(`https://dd-photography-95.onrender.com/api/auth/test-email?to=${encodeURIComponent(testEmailAddress.trim())}`);
      setTestEmailResult({
        success: true,
        message: res.data.result || "Test email dispatched successfully! Please check your inbox and spam folder."
      });
    } catch (err) {
      const errMsg = err.response?.data?.result || err.response?.data?.error || err.message;
      setTestEmailResult({
        success: false,
        message: errMsg
      });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FaSlidersH className="text-primary" /> Studio Settings & System
          </h2>
          <p className="text-muted small mb-0">
            Configure studio preferences, currency symbol, notification emails, and server diagnostics.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm d-flex align-items-center gap-2 mb-4" role="alert">
          <FaCheckCircle className="fs-5 flex-shrink-0" />
          <span><strong>Settings saved!</strong> Preferences have been updated in MySQL and applied to public pages.</span>
        </div>
      )}

      {userActionMsg && (
        <div className="alert alert-info alert-dismissible fade show shadow-sm d-flex align-items-center gap-2 mb-4" role="alert">
          <FaCheckCircle className="fs-5 flex-shrink-0" />
          <span>{userActionMsg}</span>
        </div>
      )}

      {/* Balanced 2-Column Grid */}
      <div className="row g-4">
        {/* LEFT COLUMN: Studio Configuration & System Status */}
        <div className="col-lg-6 d-flex flex-column gap-4">
          
          {/* Card 1: Studio Preferences */}
          <div className="card shadow-sm border-0">
            <div className="card-header py-3 border-bottom d-flex align-items-center gap-2">
              <FaSlidersH className="text-primary" />
              <h5 className="mb-0 fw-bold">Studio Preferences</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSaveSettings}>
                {/* Currency Selection */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Studio Currency Symbol</label>
                  <div className="d-flex gap-2 mb-2">
                    <select
                      className="form-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {CURRENCY_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.symbol}>{p.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                      placeholder="Custom"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      title="Or type custom symbol"
                    />
                  </div>
                  <small className="text-muted">Displayed on all package cards and booking forms.</small>
                </div>

                <hr className="my-3 opacity-25" />

                {/* Studio Contact Info */}
                <h6 className="fw-bold mb-3">Studio Contact Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                      <FaEnvelope size={12} className="text-muted" /> Studio Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={studioEmail}
                      onChange={(e) => setStudioEmail(e.target.value)}
                      placeholder="studio@example.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                      <FaPhoneAlt size={12} className="text-muted" /> Studio Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={studioPhone}
                      onChange={(e) => setStudioPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="acceptingBookingsSwitch"
                        checked={acceptingBookings}
                        onChange={(e) => setAcceptingBookings(e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold ms-1" htmlFor="acceptingBookingsSwitch">
                        Accept New Client Bookings
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
                  disabled={savingSettings}
                >
                  <FaSave /> {savingSettings ? "Saving Settings..." : "Save Settings"}
                </button>
              </form>
            </div>
          </div>

          {/* Card 2: System Status */}
          <div className="card shadow-sm border-0">
            <div className="card-header py-3 border-bottom d-flex align-items-center gap-2">
              <FaServer className="text-info" />
              <h5 className="mb-0 fw-bold">System & Server Status</h5>
            </div>
            <div className="card-body p-3">
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>Backend API (Spring Boot)</span>
                  <span className="badge bg-success d-flex align-items-center gap-1">
                    <FaCheckCircle size={11} /> Online (Port 8080)
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>MySQL / MariaDB Connection</span>
                  <span className="badge bg-primary d-flex align-items-center gap-1">
                    <FaDatabase size={11} /> {dbStatus}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>Logged In Administrator</span>
                  <span className="fw-bold">{adminUsername}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>Total System Bookings</span>
                  <span className="fw-bold">{stats?.totalBookings ?? 0}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>Total Active Categories</span>
                  <span className="fw-bold">{stats?.categoryCount ?? 0}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span>Registered Client Accounts</span>
                  <span className="fw-bold">{stats?.totalUsers ?? 0}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Admin Notification Accounts & Live SMTP Diagnostics */}
        <div className="col-lg-6 d-flex flex-column gap-4">
          
          {/* Card 3: Admin Accounts & Notification Emails */}
          <div className="card shadow-sm border-0">
            <div className="card-header py-3 border-bottom d-flex align-items-center gap-2">
              <FaShieldAlt className="text-warning" />
              <h5 className="mb-0 fw-bold">Admin Accounts & Notification Emails</h5>
            </div>
            <div className="card-body p-0">
              <div className="p-3 admin-info-banner border-bottom small text-muted">
                Admins receive email alerts when users log in and book sessions. 
                Configure the recipient notification email address below.
              </div>
              {adminsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary"></div>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {admins.map((admin) => (
                    <li key={admin.id} className="list-group-item p-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                      <div>
                        <div className="fw-bold d-flex align-items-center gap-2">
                          <FaShieldAlt className="text-secondary small" /> {admin.username}
                        </div>
                        {editingAdminId === admin.id ? (
                          <div className="mt-2 d-flex gap-2">
                            <input 
                              type="email" 
                              className="form-control form-control-sm" 
                              value={editAdminEmail}
                              onChange={(e) => setEditAdminEmail(e.target.value)}
                              placeholder="admin@example.com"
                            />
                          </div>
                        ) : (
                          <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                            <FaEnvelope size={12}/> {admin.email || "No email set"}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {editingAdminId === admin.id ? (
                          <div className="d-flex gap-1">
                            <button className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={() => handleSaveAdminEmail(admin.id)}>
                              <FaSave size={12}/> Save
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingAdminId(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() => {
                              setEditingAdminId(admin.id);
                              setEditAdminEmail(admin.email || "");
                            }}
                          >
                            <FaEdit size={12}/> Edit Email
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {admins.length === 0 && (
                     <li className="list-group-item p-3 text-muted text-center small">No admin accounts found in database.</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Card 4: Live SMTP Diagnostics */}
          <div className="card shadow-sm border-0">
            <div className="card-header py-3 border-bottom d-flex align-items-center gap-2">
              <FaEnvelope className="text-primary" />
              <h5 className="mb-0 fw-bold">Live SMTP Email Delivery Diagnostic</h5>
            </div>
            <div className="card-body p-4">
              <p className="small text-muted mb-3">
                Send a real test email directly from the server to verify active Gmail SMTP credentials and dispatch.
              </p>
              
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Recipient Email Address"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                />
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                >
                  <FaPaperPlane size={13} />
                  {testingEmail ? "Sending..." : "Send Test Email"}
                </button>
              </div>

              {testEmailResult && (
                <div
                  className={`alert ${testEmailResult.success ? "alert-success" : "alert-danger"} p-3 small mb-0 rounded-3`}
                  style={{ wordBreak: "break-word" }}
                >
                  <div className="fw-bold mb-1 d-flex align-items-center gap-1">
                    {testEmailResult.success ? "✅ Delivery Succeeded" : "❌ Delivery Failed"}
                  </div>
                  <div>{testEmailResult.message}</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
