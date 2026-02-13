import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function UserAuth({ hideNavbarFooter }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup
        ? "http://localhost:8080/api/users/register"
        : "http://localhost:8080/api/users/login";

      const response = await axios.post(url, form);

      if (!isSignup) {
        // LOGIN
        localStorage.setItem("user", response.data.token);
        alert("✅ Login successful!");
        window.location.href = "/";
      } else {
        // SIGNUP
        alert("✅ Registration successful! Please login.");
        setIsSignup(false);
      }

    } catch (error) {
      if (error.response?.data?.error) {
        alert("❌ " + error.response.data.error);
      } else {
        alert("❌ Something went wrong! Check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="card shadow p-4">
        <h3 className="text-center mb-4">{isSignup ? "User Signup" : "User Login"}</h3>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-primary ms-2"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}
