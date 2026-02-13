import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


export default function AdminOrders() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:8080/api/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:8080/api/bookings/${id}`, { status });
    fetchBookings();
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="mb-4 text-center">Manage Orders</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{new Date(b.date).toLocaleString()}</td>
                <td>{b.status || "Pending"}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(b.id, "Confirmed")}>Confirm</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b.id, "Cancelled")}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
