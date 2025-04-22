import React from "react";
import { useNavigate } from "react-router-dom";
import a1 from "./inspired/a1.png";
import a2 from "./inspired/a2.png";
import a3 from "./inspired/a3.png";
import a4 from "./inspired/a4.png";
import a5 from "./inspired/a5.png";
import a6 from "./inspired/a6.png";
import a7 from "./inspired/a7.png";
import a8 from "./inspired/a8.png";
import a9 from "./inspired/a9.png";
import a10 from "./inspired/a10.png";
import a11 from "./inspired/a11.png";
import a12 from "./inspired/a12.png";

const Offers = () => {
  const navigate = useNavigate();

  const offers = [
    {
      id: 1,
      title: "Travel to Europe - Save 25%",
      oldPrice: "$1066.65",
      newPrice: "$799.99",
      discount: "25%",
      image: a1,
    },
    {
      id: 2,
      title: "Refurbished iPhone 13 Pro Max",
      oldPrice: "$699.99",
      newPrice: "$539.99",
      discount: "22%",
      image: a2,
    },
    {
      id: 3,
      title: "Unlimited Mobile Plan - 1st Month Free",
      oldPrice: "$39.99",
      newPrice: "$19.99",
      discount: "50%",
      image: a3,
    },
    {
      id: 4,
      title: "10x Payment Plan Available",
      oldPrice: "$0.00",
      newPrice: "$0.00",
      discount: "0%",
      image: a4,
    },
    {
      id: 5,
      title: "Loyalty Program: Earn Double Points",
      oldPrice: "$9.99",
      newPrice: "Free",
      discount: "100%",
      image: a5,
    },
    {
      id: 6,
      title: "Refurbished Samsung Galaxy S21",
      oldPrice: "$429.99",
      newPrice: "$299.99",
      discount: "30%",
      image: a6,
    },
    {
      id: 7,
      title: "Wireless Earbuds - Premium Sound",
      oldPrice: "$89.99",
      newPrice: "$59.99",
      discount: "33%",
      image: a7,
    },
    {
      id: 8,
      title: "Gaming Laptop - RTX Series",
      oldPrice: "$1499.99",
      newPrice: "$1199.99",
      discount: "20%",
      image: a8,
    },
    {
      id: 9,
      title: "Smartwatch Gen 6",
      oldPrice: "$199.99",
      newPrice: "$129.99",
      discount: "35%",
      image: a9,
    },
    {
      id: 10,
      title: "Noise-Cancelling Headphones",
      oldPrice: "$249.99",
      newPrice: "$199.99",
      discount: "20%",
      image: a10,
    },
    {
      id: 11,
      title: "Fitness Tracker - Pro Edition",
      oldPrice: "$79.99",
      newPrice: "$49.99",
      discount: "38%",
      image: a11,
    },
    {
      id: 12,
      title: "4K Smart TV - 55 Inch",
      oldPrice: "$599.99",
      newPrice: "$449.99",
      discount: "25%",
      image: a12,
    },
    {
      id: 13,
      title: "Bluetooth Speaker - Waterproof",
      oldPrice: "$59.99",
      newPrice: "$39.99",
      discount: "33%",
      image: a1,
    },
    {
      id: 14,
      title: "Gaming Chair - Ergonomic",
      oldPrice: "$249.99",
      newPrice: "$189.99",
      discount: "24%",
      image: a2,
    },
    {
      id: 15,
      title: "Home Security Camera - Wireless",
      oldPrice: "$129.99",
      newPrice: "$89.99",
      discount: "31%",
      image: a3,
    },
    {
      id: 16,
      title: "Home Security Camera - Wireless",
      oldPrice: "$129.99",
      newPrice: "$89.99",
      discount: "31%",
      image: a4,
    },
  ];

  return (
    <div className="bg-light py-5">
      <div className="container">
        <h2 className="fw-normal fs-3 mb-4">Our Current Offers</h2>

        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="border rounded bg-white p-3 h-100 shadow-sm">
                <div className="position-relative mb-2">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="img-fluid mx-auto d-block"
                    style={{ maxHeight: "160px" }}
                  />
                  {offer.discount !== "0%" && offer.discount !== "100%" && (
                    <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded-start">
                      -{offer.discount}
                    </div>
                  )}
                </div>
                <h5 className="fs-6 mb-2">{offer.title}</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">
                      <del>{offer.oldPrice}</del>
                    </div>
                    <div className="fw-bold text-danger">{offer.newPrice}</div>
                  </div>
                  <button
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: "#1a1a1a" }}
                    onClick={() => navigate("/contact")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Offers;
