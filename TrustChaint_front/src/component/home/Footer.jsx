import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="text-white pt-0">
      <div className="bg-white text-center py-2">
        <a href="#top" className="text-dark fw-semibold text-decoration-none">
          Back to top <FaArrowUp className="ms-2" size={12} />
        </a>
      </div>
      <div className="bg-dark text-center py-3">
        <p className="mb-2">
          Millions of you already follow us to get our news, tips, and great deals!
        </p>
        <div className="d-flex justify-content-center gap-3 fs-4">
          <CiFacebook />
          <FaSquareXTwitter />
          <FaInstagram />
          <FiYoutube />
        </div>
      </div>
      <div className="bg-secondary text-white py-4">
        <div className="container">
          <div className="row gy-4">
            <div className="col-12 col-md-4 col-lg-2">
              <h6 className="fw-bold">SERVICES & WARRANTIES</h6>
              <ul className="list-unstyled">
                <li>Warranties & insurance</li>
                <li>My customer space</li>
                <li>My orders</li>
                <li>Our CSR commitments</li>
              </ul>
            </div>

            <div className="col-12 col-md-4 col-lg-2 border-start ps-3">
              <h6 className="fw-bold">DELIVERY & PAYMENT</h6>
              <ul className="list-unstyled">
                <li>Delivery methods & fees</li>
                <li>Eco-contributions & take-back</li>
                <li>Payment methods</li>
                <li>Secure payment</li>
                <li>TrustChain Unlimited</li>
                <li>Payment in installments</li>
              </ul>
            </div>

            <div className="col-12 col-md-4 col-lg-2 border-start ps-3">
              <h6 className="fw-bold">CONTACT US</h6>
              <ul className="list-unstyled">
                <li>Customer Service Contact</li>
                <li>Advertising Contact</li>
                <li>TrustChain is hiring</li>
                <li>Affiliation</li>
                <li>Report illegal content</li>
                <li>TrustChain Dropshipping</li>
              </ul>
            </div>

            <div className="col-12 col-md-4 col-lg-2 border-start ps-3">
              <h6 className="fw-bold">MARKETPLACE</h6>
              <ul className="list-unstyled">
                <li>Sell on TrustChain</li>
                <li>Seller space access</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div className="col-12 col-md-4 col-lg-3 border-start ps-3">
              <h6 className="fw-bold">LEGAL INFORMATION</h6>
              <ul className="list-unstyled">
                <li>General Terms & Conditions of Sale</li>
                <li>Marketplace Terms of Use</li>
                <li>Privacy & cookies protection</li>
                <li>Referencing & ranking</li>
                <li>Legal notices</li>
                <li>Digital accessibility</li>
                <li>Product recalls</li>
                <li>Manage my cookies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
