import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { FaCalendarCheck, FaClock, FaUsers } from "react-icons/fa";

const COLORS = ["#B5622E", "#9A7A60", "#9E5227"];

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("https://dd-photography-95.onrender.com/api/admin/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const bookingData = [
    { name: "Pending", value: stats.pendingBookings },
    { name: "Confirmed", value: stats.confirmedBookings },
    { name: "Cancelled", value: stats.cancelledBookings }
  ];

  const photoData = [
    { name: "Gallery", count: stats.galleryCount },
    { name: "Category", count: stats.categoryCount }
  ];

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* CARDS */}
      <div className="row g-4 mb-5">
        <StatCard title="Total Bookings" value={stats.totalBookings} type="bookings" icon={FaCalendarCheck} />
        <StatCard title="Pending Orders" value={stats.pendingBookings} type="orders" icon={FaClock} />
        <StatCard title="Registered Users" value={stats.totalUsers} type="users" icon={FaUsers} />
      </div>

      {/* CHARTS */}
      <div className="row g-4">
        {/* Booking Status Pie */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title text-center mb-4">Booking Status</h5>
              <PieChart width={300} height={300}>
                <Pie
                  data={bookingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {bookingData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-color)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '10px'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Photo Usage Bar */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title text-center mb-4">Photo Usage</h5>
              <BarChart width={300} height={300} data={photoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-color)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '10px'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Bar dataKey="count" fill="var(--accent-color)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, type, icon: Icon }) {
  return (
    <div className="col-md-4">
      <div className={`admin-stat-card stat-${type} shadow-sm text-center`}>
        <div className="admin-stat-icon-badge mx-auto mb-2">
          <Icon size={18} />
        </div>
        <div className="admin-stat-title">{title}</div>
        <div className="admin-stat-value">{value ?? 0}</div>
      </div>
    </div>
  );
}

