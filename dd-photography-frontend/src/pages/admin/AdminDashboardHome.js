import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#ffc107", "#28a745", "#dc3545"];

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/dashboard")
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
    { name: "Carousel", count: stats.carouselCount },
    { name: "Gallery", count: stats.galleryCount },
    { name: "Category", count: stats.categoryCount }
  ];

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* CARDS */}
      <div className="row g-4 mb-5">
        <StatCard title="Total Bookings" value={stats.totalBookings} color="primary" />
        <StatCard title="Pending Orders" value={stats.pendingBookings} color="warning" />
        <StatCard title="Unread Messages" value={stats.unreadMessages} color="danger" />
      </div>

      {/* CHARTS */}
      <div className="row">
        {/* Booking Status Pie */}
        <div className="col-md-6">
          <div className="card shadow p-3">
            <h5 className="text-center">Booking Status</h5>
            <PieChart width={400} height={300}>
              <Pie
                data={bookingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {bookingData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Photo Usage Bar */}
        <div className="col-md-6">
          <div className="card shadow p-3">
            <h5 className="text-center">Photo Usage</h5>
            <BarChart width={400} height={300} data={photoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0d6efd" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="col-md-4">
      <div className={`card bg-${color} text-white shadow`}>
        <div className="card-body text-center">
          <h6>{title}</h6>
          <h2>{value}</h2>
        </div>
      </div>
    </div>
  );
}
