import React, { useState } from "react";
import { IoMdPerson, IoMdMailUnread } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LoginUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/home";

  const [action, setAction] = useState("Log In");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "http://localhost:8001/auth/register";

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, {
        name,
        age: parseInt(age),
        email,
        password,
      });
      alert("Sign up successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Sign up failed");
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8001/auth/login-json", {
        email,
        password,
      });
      localStorage.setItem("user", res.data.user.name);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user.user_id);
      localStorage.setItem("user_email",res.data.user.email);
      navigate(redirect);
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
          <h1 className="fw-bold" style={{ color: "#FFD700", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
            {action}
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

        <form onSubmit={action === "Sign Up" ? handleSignUp : handleLogIn}>
          <div className="d-flex flex-column gap-4">
            {action === "Sign Up" && (
              <>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <IoMdPerson />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-white border-end-0">🎂</span>
                  <input
                    type="number"
                    className="form-control border-start-0"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <IoMdMailUnread />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="Email"
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

          {action === "Log In" && (
            <div className="mt-3 text-start" style={{ fontSize: "18px" }}>
              Forgot Password?{" "}
              <span
                className="text-warning text-decoration-underline"
                style={{ cursor: "pointer", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
              >
                Click here!
              </span>
            </div>
          )}

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-dark btn-lg fw-bold">
              {action}
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-center gap-3 mt-5">
          <button
            className={`btn px-5 py-3 fw-bold rounded-pill shadow ${
              action === "Log In" ? "btn-light text-muted border" : "btn-warning text-dark border-white"
            }`}
            onClick={() => setAction("Sign Up")}
          >
            Sign Up
          </button>
          <button
            className={`btn px-5 py-3 fw-bold rounded-pill shadow ${
              action === "Sign Up" ? "btn-light text-muted border" : "btn-warning text-dark border-white"
            }`}
            onClick={() => setAction("Log In")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
