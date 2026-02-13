import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", username);

      alert("✅ Admin login successful!");
      window.location.href = "/admin";

    } catch (error) {
      if (error.response && error.response.data?.error) {
        alert("❌ " + error.response.data.error);
      } else {
        alert("❌ Server error. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
