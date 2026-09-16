import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa";

const STATUS_COLORS = {
  CONFIRMED: { bg: '#198754', label: 'CONFIRMED' },
  CANCELLED: { bg: '#dc3545', label: 'CANCELLED' },
  PENDING: { bg: '#f59e0b', label: 'PENDING' },
};

export default function AdminOrders() {
  const [bookings, setBookings] = useState([]);
  const [timeFilter, setTimeFilter] = useState("ALL"); // ALL | TODAY | WEEK | MONTH
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      // Sort newest first
      const sorted = (res.data || []).sort((a, b) => b.id - a.id);
      setBookings(sorted);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/status`, null, { params: { status } });
      await fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.error || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(b => {
      // Time filter by eventDate
      if (timeFilter !== "ALL" && b.eventDate) {
        const eventDate = new Date(b.eventDate);
        if (timeFilter === "TODAY") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrow = new Date(today.getTime() + 86400000);
          if (eventDate < today || eventDate >= tomorrow) return false;
        } else if (timeFilter === "WEEK") {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
          if (eventDate < weekStart || eventDate >= weekEnd) return false;
        } else if (timeFilter === "MONTH") {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          if (eventDate < monthStart || eventDate >= monthEnd) return false;
        }
      }
      // Status filter
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (b.name && b.name.toLowerCase().includes(q)) ||
          (b.email && b.email.toLowerCase().includes(q)) ||
          (b.packageType && b.packageType.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [bookings, timeFilter, statusFilter, searchQuery]);

  const counts = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => !b.status || b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }), [bookings]);

  const TIME_BUTTONS = [
    { key: "ALL", label: "All" },
    { key: "TODAY", label: "Today" },
    { key: "WEEK", label: "This Week" },
    { key: "MONTH", label: "This Month" },
  ];

  return (
    <div className="container-fluid pb-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Booking Orders</h2>
          <p className="text-muted small mb-0">Manage and respond to all client booking requests.</p>
        </div>

        {/* Time Filter Buttons */}
        <div className="d-flex gap-2 align-items-center">
          <FaCalendarAlt className="text-muted" />
          {TIME_BUTTONS.map(btn => (
            <button
              key={btn.key}
              className="btn btn-sm fw-semibold rounded-pill px-3"
              style={{
                background: timeFilter === btn.key ? 'var(--accent-color)' : 'var(--surface-color)',
                color: timeFilter === btn.key ? 'white' : 'var(--text-primary)',
                border: `1px solid ${timeFilter === btn.key ? 'var(--accent-color)' : 'var(--border-color)'}`,
                transition: 'all 0.2s ease'
              }}
              onClick={() => setTimeFilter(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total', count: counts.total, color: '#6366f1' },
          { label: 'Pending', count: counts.pending, color: '#f59e0b' },
          { label: 'Confirmed', count: counts.confirmed, color: '#10b981' },
          { label: 'Cancelled', count: counts.cancelled, color: '#ef4444' },
        ].map(stat => (
          <div className="col-6 col-md-3" key={stat.label}>
            <div className="card border-0 shadow-sm text-center py-3" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="fw-bold fs-3" style={{ color: stat.color }}>{stat.count}</div>
              <div className="small text-muted fw-semibold">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body py-3 d-flex flex-wrap gap-3 align-items-center">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <FaSearch className="text-muted" size={14} />
            <input
              className="form-control form-control-sm border-0 bg-transparent"
              placeholder="Search by name, email, or package..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaFilter className="text-muted" size={14} />
            <select
              className="form-select form-select-sm border-0"
              style={{ width: 'auto', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {filteredBookings.length} result{filteredBookings.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="small" style={{ background: 'var(--surface-color)' }}>
              <tr>
                <th className="ps-4 py-3">ID</th>
                <th>Client</th>
                <th>Event Date</th>
                <th>Package</th>
                <th>Message</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(b => {
                  const statusMeta = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING;
                  const isUpdating = updatingId === b.id;
                  return (
                    <tr key={b.id}>
                      <td className="ps-4 text-muted small fw-bold">#{b.id}</td>
                      <td>
                        <div className="fw-bold">{b.name}</div>
                        <small className="text-muted">{b.email}</small>
                        {b.phone && <><br /><small className="text-muted">{b.phone}</small></>}
                      </td>
                      <td>
                        <div className="fw-semibold small">
                          {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                        </div>
                      </td>
                      <td>
                        <span className="badge rounded-pill" style={{ background: 'rgba(181,98,46,0.15)', color: 'var(--accent-color)', border: '1px solid rgba(181,98,46,0.3)', fontWeight: 600 }}>
                          {b.packageType || "Standard"}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted" style={{ maxWidth: 180, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.message || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="badge rounded-pill px-3 py-2" style={{ background: statusMeta.bg, color: 'white', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {b.status !== 'CONFIRMED' && (
                          <button
                            className="btn btn-sm btn-success me-1 rounded-pill d-inline-flex align-items-center gap-1 px-3"
                            onClick={() => updateStatus(b.id, "CONFIRMED")}
                            disabled={isUpdating}
                          >
                            <FaCheck size={11} />
                            {isUpdating ? '...' : 'Accept'}
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            className="btn btn-sm btn-danger rounded-pill d-inline-flex align-items-center gap-1 px-3"
                            onClick={() => updateStatus(b.id, "CANCELLED")}
                            disabled={isUpdating}
                          >
                            <FaTimes size={11} />
                            {isUpdating ? '...' : 'Reject'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <FaCalendarAlt className="mb-2 opacity-25" size={32} />
                    <div>No bookings found for the selected filter.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
