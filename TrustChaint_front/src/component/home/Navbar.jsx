import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { useCart } from "../../context/CartContext"; // Make sure this is correct

const RAYONS = [
  "Home Appliances", "Computing", "Phones", "Home",
  "Garden", "Beauty" , "Kids", "Sports", "Fashion",
  "Automobiles","gaming", "Garden", "Pets", "Books & Culture",
];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // From context
  const [showpopup, setpopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

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

  return (
    <div>
      {/* Fixed Navbar Section */}
      <div
        className="bg-dark text-white"
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 1050 }}
      >
        {/* Top Logo and Search */}
        <div className="container-fluid py-2">
          <div className="row align-items-center">
            {/* Logo - increased size */}
            <div className="col-md-2 text-center">
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "95%", height: "auto", cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            {/* Search Bar - smaller height but wider */}
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

            {/* User and Cart Container - now positioned to the right */}
            <div className="col-md-3">
              <div className="d-flex justify-content-end align-items-center">
                {/* Sign In */}
                {!localStorage.getItem('token')?<div
                  className="d-flex flex-column align-items-center text-warning"
                  onClick={() => navigate("/login")}
                  role="button"
                >
                  <AiOutlineUser size={24} />
                  <p className="mb-0 small">Sign in</p>
                </div>:<div
                  className="d-flex flex-column align-items-center text-warning"
                  
                  role="button"
                >
                  <AiOutlineUser size={24} />
                  <p onClick={()=>{navigate('/account')}} className="mb-0 small"><b>{localStorage.getItem('user')}</b></p>
                </div>}

                {/* Cart with margin-right */}
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
                    {cartItems.length}
                  </span>
                  <p className="mb-0 small">My cart</p>
                </div>
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

      {/* Popup Menu */}
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

          {/* Hide scrollbar (CSS must be outside JSX) */}
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