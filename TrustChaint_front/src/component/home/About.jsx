import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./About.css"; // Import your CSS file for custom styles

const About = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <section style={{ backgroundColor: "#1a1a1a", height:"740px" }} className="text-white py-5">
      <div className="container">
        <h1 className="display-5 fw-bold mb-4 text-center">
          About <span className="text-warning">Us</span>
        </h1>

        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <p className="lead text-light">
              At <strong><b>TrustChain</b></strong>, we’re passionate about
              revolutionizing e-commerce. Our mission is simple: provide a{" "}
              <span className="text-warning">secure, transparent</span> and{" "}
              <span className="text-warning">empowering</span> shopping
              experience using the power of blockchain technology.
            </p>
          </div>
        </div>

        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-4">
            <h4 className="fw-semibold text-warning">Why Blockchain?</h4>
            <p>
              Traditional online shopping can feel like a black box. We ensure
              that every transaction is tamper-proof, traceable, and
              transparent. Your data stays safe. Your money stays yours.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h4 className="fw-semibold text-warning">What We Offer</h4>
            <ul className="list-unstyled">
              <li>✔ Premium-quality products</li>
              <li>✔ Real-time shipping tracking</li>
              <li>✔ Verifiable customer reviews</li>
              <li>✔ Seamless shopping experience</li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h4 className="fw-semibold text-warning">Our Vision</h4>
            <p>
              We’re not just a store—we’re building the future of e-commerce.
              One where trust, fairness, and customer empowerment come first.
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <h5 className="fw-semibold mb-3">Join Us</h5>
          <p className="text-light">
            Whether you're a first-time buyer or a blockchain enthusiast, we invite you to shop with confidence. Welcome to the future of shopping.
          </p>

          {/* Start Shopping Button */}
          <button onClick={() => navigate("/product")} className="btn btn-warning mt-3 px-4">
            Start Shopping
          </button>
          
          {/* Go Back to Home Link */}
          <p className="mt-2">
            <button onClick={() => navigate("/home")} className="text-white text-decoration-underline border-0 bg-transparent">
              Go Back to Home
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
