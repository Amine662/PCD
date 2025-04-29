import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { useCart } from "../../context/CartContext";

const RAYONS = [
  "Home Appliances", "Computing", "Phones", "Home",
  "Garden", "Beauty", "Kids", "Sports", "Fashion",
  "Automobiles", "Gaming", "Garden", "Pets", "Books & Culture",
];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [showpopup, setpopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const userRole = localStorage.getItem("role"); // get role
  const userName = localStorage.getItem("user");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (showpopup) {
      const container = document.querySelector(".rayon-trigger");
      if (container) {
        const rect = container.getBoundingClientRect();
        setPopupPosition({
          top: rect.bottom,
          left: rect.left,
        });
      }
    }
  }, [showpopup]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      <div
        className="bg-dark text-white"
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 1050 }}
      >
        <div className="container-fluid py-2">
          <div className="row align-items-center">
            <div className="col-md-2 text-center">
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "95%", height: "auto", cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            <div className="col-md-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="What would make you happy?"
                  style={{ height: "38px" }}
                />
                <button className="btn btn-warning px-3" style={{ height: "38px" }}>
                  <IoSearch size={20} />
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex justify-content-end align-items-center">

                {/* User Icon */}
                <div
                  className="position-relative"
                  onMouseEnter={() => setShowUserPopup(true)}
                  onMouseLeave={() => setShowUserPopup(false)}
                >
                  <div
                    className="d-flex flex-column align-items-center text-warning"
                    role="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate("/login");
                      }
                    }}
                  >
                    <AiOutlineUser size={24} />
                    <p className="mb-0 small">
                      {isLoggedIn ? <b>{userName}</b> : "Sign in"}
                    </p>
                  </div>

                  {/* User Popup */}
                  {showUserPopup && isLoggedIn && (
                    <div
                      className="position-absolute user-popup"
                      style={{
                        top: "45px",
                        right: 0,
                        zIndex: 999,
                        minWidth: "180px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                      }}
                    >
                      <div className="d-grid gap-2 p-2">
                        {userRole !== "admin" && (
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => navigate("/account")}
                          >
                            View Profile
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <div
                  className="d-flex flex-column align-items-center position-relative text-warning"
                  onClick={() => navigate("/addtocart")}
                  role="button"
                  style={{ marginLeft: "30px", marginRight: "20px" }}
                >
                  <CiShoppingCart size={24} />
                  <span
                    className="badge bg-warning text-dark"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      fontSize: "0.8rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "50%",
                      fontWeight: "bold",
                    }}
                  >
                    {/*cartItems.length*/}
                  </span>
                  <p className="mb-0 small">My cart</p>
                </div>

                {/* Seller Dashboard Button */}
                {userRole === "seller" && (
                  <div
                    className="d-flex flex-column align-items-center text-warning"
                    onClick={() => navigate("/seller-dashboard")}
                    style={{ marginLeft: "30px", marginRight: "20px", cursor: "pointer" }}
                  >
                    <MdFormatListBulletedAdd size={24} />
                    <p className="mb-0 small">My Dashboard</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="py-2">
          <div className="container">
            <ul className="nav justify-content-start gap-3">
              <li className="nav-item">
                <button
                  className="btn btn-outline-light d-flex align-items-center gap-1 rayon-trigger"
                  onClick={() => setpopup(true)}
                >
                  <MdFormatListBulletedAdd />
                  All categories
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-warning" onClick={() => navigate("/contact")}>
                  Promo
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary">Voyages</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => navigate("/contact")}>
                  Forfait Mobile
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => navigate("/contact")}>
                  Reconditionné
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => navigate("/contact")}>
                  Paiement 10x
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => navigate("/contact")}>
                  Programme de fidélité
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: "180px" }}></div>

      {/* Category Popup */}
      {showpopup && (
        <div
          className="position-fixed bg-white shadow-lg"
          style={{
            width: "300px",
            height: "450px",
            top: popupPosition.top,
            left: popupPosition.left,
            zIndex: 1060,
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3">
            <h5 className="m-0 text-uppercase fs-5">Our categories</h5>
            <FiX
              className="cursor-pointer text-white fs-4"
              onClick={() => setpopup(false)}
              role="button"
            />
          </div>

          <div className="d-flex align-items-center p-3">
            <img
              src="https://i2.cdscdn.com/nav/images/20.jpg"
              alt="Promo"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            />
            <h6 className="m-0 fs-6 fw-semibold">Promo</h6>
          </div>

          <div
            className="list-group list-group-flush px-3 pb-3 rayon-scroll"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {RAYONS.map((rayon) => (
              <button
                key={rayon}
                className="list-group-item list-group-item-action d-flex align-items-center p-2 border-0"
                style={{
                  background: "#f9f9f9",
                  marginBottom: "5px",
                }}
                onClick={() => navigate(`/rayon/${encodeURIComponent(rayon)}`)}
              >
                {rayon}
              </button>
            ))}
          </div>

          {/* Hide scrollbar */}
          <style>{`
            .rayon-scroll::-webkit-scrollbar {
              display: none;
            }
            .rayon-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Navbar;
