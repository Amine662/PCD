import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SecureShopping.css";
import { MdHighQuality } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { MdOutlineVerifiedUser } from "react-icons/md";

const SecureShopping = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <section className="position-relative text-white bg-dark overflow-hidden secure-shopping-bg">
      {/* Floating shapes */}
      <div className="floating-shapes position-absolute w-100 h-100">
        <div className="shape purple"></div>
        <div className="shape indigo"></div>
        <div className="shape teal"></div>
      </div>

      <div className="container py-5 py-md-5 position-relative" style={{ zIndex: 10 }}>
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-5 fw-bold mb-4">
              Secure Shopping <br />
              <span className="text-gradient">With Blockchain</span>
            </h1>
            <p className="lead text-light mb-4">
              Experience the future of e-commerce with secure, transparent transactions backed by blockchain technology.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-3">
              <button onClick={() => navigate("/product")} className="btn btn-light text-dark shadow">
                Shop Now
              </button>
              <button onClick={() => navigate("/about")} className="btn btn-outline-light">
                Learn More
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="col-md-6 d-none d-md-block position-relative">
            <div className="position-relative" style={{ height: "400px" }}>
              <div className="rounded-4 shadow position-absolute w-100 h-100"
                style={{ transform: "rotate(3deg)", overflow: "hidden", backgroundColor: "#fff" }}>
                <img
                  src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt="Secure shopping"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="bg-white bg-opacity-10 p-4 rounded shadow-sm h-100 text-center feature-box">
              <MdOutlineVerifiedUser size={40} className="text-white mx-auto bg-warning rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }} />
              <h5 className="fw-semibold mb-2">Secure Transactions</h5>
              <p className="text-light small">
                All transactions are secured with blockchain technology for ultimate protection and transparency.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-white bg-opacity-10 p-4 rounded shadow-sm h-100 text-center feature-box">
              <MdHighQuality size={35} className="text-white mx-auto bg-info rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }} />
              <h5 className="fw-semibold mb-2">Quality Products</h5>
              <p className="text-light small">
                Curated selection of premium products with verified reviews and ratings from real customers.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-white bg-opacity-10 p-4 rounded shadow-sm h-100 text-center feature-box">
              <IoMdTime size={35} className="text-white mx-auto bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }} />
              <h5 className="fw-semibold mb-2">Fast Delivery</h5>
              <p className="text-light small">
                Track your orders in real-time with our blockchain-verified shipping and delivery system.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-5">
          <button onClick={() => navigate("/product")} className="btn btn-link text-warning fs-5 border-0 bg-transparent">
            Explore Our Latest Products <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecureShopping;
