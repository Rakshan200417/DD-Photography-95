import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaSearch,
  FaTrash,
  FaUserCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaUserCircle
} from "react-icons/fa";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/users/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
      setErrorMsg(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMsg("Failed to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userEmail, userName) => {
    const displayName = userName || userEmail;
    if (
      !window.confirm(
        `Are you sure you want to delete user "${displayName}"?\n\nThis user will no longer be able to log in. Their historical bookings will be safely preserved.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setActionMsg(`User "${displayName}" has been successfully removed.`);
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.error || err.message));
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = u.username && u.username.toLowerCase().includes(q);
    const emailMatch = u.email && u.email.toLowerCase().includes(q);
    const idMatch = String(u.id).includes(q);
    return nameMatch || emailMatch || idMatch;
  });

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FaUsers className="text-primary" /> User Management
          </h2>
          <p className="text-muted small mb-0">
            View, search, and manage registered client accounts across DD Photography 95.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge px-3 py-2 rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-semibold">
            {users.length} Total {users.length === 1 ? "User" : "Users"}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {actionMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm d-flex align-items-center gap-2" role="alert">
          <FaCheckCircle className="fs-5 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger shadow-sm d-flex align-items-center gap-2" role="alert">
          <FaExclamationTriangle className="fs-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          {/* Search Box */}
          <div className="input-group" style={{ maxWidth: "380px" }}>
            <span className="input-group-text bg-transparent border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </button>
            )}
          </div>

          <span className="small text-muted">
            Showing {filteredUsers.length} of {users.length} clients
          </span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
              <p className="text-muted small mb-0">Loading registered clients...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaUsers className="fs-1 mb-2 opacity-25" />
              <p className="mb-0">
                {searchQuery ? `No users matching "${searchQuery}"` : "No registered users found."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="small">
                  <tr>
                    <th style={{ width: "70px" }} className="ps-4">ID</th>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Account Status</th>
                    <th className="text-end pe-4" style={{ width: "120px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const initials = (u.username || u.email || "U").substring(0, 2).toUpperCase();
                    return (
                      <tr key={u.id}>
                        <td className="ps-4 text-muted small fw-semibold">#{u.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
                              style={{
                                width: "36px",
                                height: "36px",
                                background: "var(--accent-color, #B5622E)",
                                fontSize: "0.85rem"
                              }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="fw-bold text-truncate" style={{ maxWidth: "200px" }}>
                                {u.username || "Client"}
                              </div>
                              <div className="small text-muted d-sm-none">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2 small">
                            <FaEnvelope className="text-muted flex-shrink-0" size={13} />
                            <span className="text-truncate" style={{ maxWidth: "250px" }} title={u.email}>
                              {u.email}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill small">
                            <FaUserCheck className="me-1" size={11} /> Registered
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 px-3 py-1"
                            title="Delete user"
                            onClick={() => handleDeleteUser(u.id, u.email, u.username)}
                          >
                            <FaTrash size={12} />
                            <span className="small">Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
