import React, { useState } from "react";
import { IoMdMailUnread } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginAdmin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8001/auth/login-admin", {
        email,
        password,
      });
      localStorage.setItem("user", res.data.user.name);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("admin_id", res.data.user.user_id);
      navigate("/dashboard" );
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100 position-relative"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Link
        to="/"
        className="btn btn-outline-dark position-absolute top-0 start-0 m-4 d-flex align-items-center"
        style={{ fontWeight: "bold", borderRadius: "20px" }}
      >
        <i className="bi bi-arrow-left me-2"></i> Back to Home
      </Link>

      <div
        className="p-5 rounded shadow-lg w-100 text-white"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #d3d3d3, #c0c0c0)",
        }}
      >
        <div className="text-center mb-4">
          <h1
            className="fw-bold"
            style={{
              color: "#FFD700",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Login Admin
          </h1>
          <div
            className="mx-auto my-2"
            style={{
              width: "100px",
              height: "6px",
              background: "#FFD700",
              borderRadius: "9px",
              boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          ></div>
        </div>

        <form onSubmit={handleLogIn}>
          <div className="d-flex flex-column gap-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <IoMdMailUnread />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaKey />
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 text-start" style={{ fontSize: "18px" }}>
            Forgot Password?{" "}
            <span
              className="text-warning text-decoration-underline"
              style={{
                cursor: "pointer",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              Click here!
            </span>
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-dark btn-lg fw-bold">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
