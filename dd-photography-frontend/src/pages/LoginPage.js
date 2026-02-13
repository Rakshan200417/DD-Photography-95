import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserAuth from "./UserAuth";
import AdminLogin from "./AdminLogin";

export default function LoginPage() {
  const [tab, setTab] = useState("user"); // default user

  return (
    <>
      <Navbar />
      <div className="container my-5">

        {/* Buttons to switch tabs */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className={`btn mx-2 ${tab === "user" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTab("user")}
          >
            User Login / Signup
          </button>

          <button
            className={`btn mx-2 ${tab === "admin" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTab("admin")}
          >
            Admin Login
          </button>
        </div>

        {/* Show pages inside card */}
        <div className="row justify-content-center">
          <div className="col-md-6">

            {tab === "user" ? (
              <UserAuth hideNavbarFooter={true} />
            ) : (
              <AdminLogin hideNavbarFooter={true} />
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
