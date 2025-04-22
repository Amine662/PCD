import React, { useState } from "react";
import { IoMdPerson, IoMdMailUnread } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";



const LoginSignUp = () => {
  const [action, setAction] = useState("Log In");
  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100 position-relative"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Back to Home Button */}
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
          background: "linear-gradient(135deg, #d3d3d3, #c0c0c0)", // Lighter gradient background
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold"
            style={{
              color: "#FFD700", // Golden text color
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)", // Subtle shadow for depth
            }}
          >
            {action}
          </h1>
          <div
            className="mx-auto my-2"
            style={{
              width: "100px",
              height: "6px",
              background: "#FFD700", // Golden accent bar
              borderRadius: "9px",
              boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Subtle shadow
            }}
          ></div>
        </div>

        {/* Form Inputs */}
        <form>
          <div className="d-flex flex-column gap-4">
            {action === "Sign Up" && (
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <IoMdPerson />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Name"
                />
              </div>
            )}

            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <IoMdMailUnread />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="Email"
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
              />
            </div>
          </div>

          {/* Forgot Password (only for Log In) */}
          {action === "Log In" && (
            <div className="mt-3 text-start" style={{ fontSize: "18px" }}>
              Forgot Password?{" "}
              <span
                className="text-warning text-decoration-underline"
                style={{
                  cursor: "pointer",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Subtle shadow for emphasis
                }}
              >
                Click here!
              </span>
            </div>
          )}
        </form>

        {/* Toggle Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-5">
          <button
            className={`btn px-5 py-3 fw-bold rounded-pill shadow ${
              action === "Log In"
                ? "btn-light text-muted border"
                : "btn-warning text-dark border-white"
            }`}
            onClick={() => setAction("Sign Up")}
          >
            Sign Up
          </button>
          <button
            className={`btn px-5 py-3 fw-bold rounded-pill shadow ${
              action === "Sign Up"
                ? "btn-light text-muted border"
                : "btn-warning text-dark border-white"
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

export default LoginSignUp;
