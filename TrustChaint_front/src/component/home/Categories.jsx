import React, { useRef } from "react";
import b1 from "./inspired/b1.png";
import b2 from "./inspired/b2.png";
import b3 from "./inspired/b3.png";
import b4 from "./inspired/b4.png";
import b5 from "./inspired/b5.png";
import b6 from "./inspired/b6.png";
import b7 from "./inspired/b7.png";
import b8 from "./inspired/b8.png";
import b9 from "./inspired/b9.png";
import b10 from "./inspired/b10.png";
import b11 from "./inspired/b11.png";
import b12 from "./inspired/b12.png";
import b13 from "./inspired/b13.png";
import b14 from "./inspired/b14.png";
import "./Categories.css";

const images = [
  b1, b2, b3, b4, b5, b6, b7,
  b8, b9, b10, b11, b12, b13, b14
];

const titles = [
  "Home Appliances", "Computing", "Phones", "Home",
  "Garden", "Beauty" , "Kids", "Sports", "Fashion",
  "Automobiles","gaming", "Garden", "Pets", "Books & Culture",
];

const Categories = () => {
  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-light mt-5 py-4">
      <div className="container">
        <h2 className="fw-normal fs-3 mb-4">Explore our categories</h2>

        <div className="position-relative">
          <button className="scroll-btn left btn" onClick={() => scroll(-200)}>
            ‹
          </button>

          <div
            className="category-scroll d-flex gap-3 overflow-auto pb-3"
            ref={scrollRef}
          >
            {images.map((src, i) => (
              <div key={i} className="flex-shrink-0 category-item">
                <div className="category-box text-center shadow-sm bg-white rounded border p-2">
                  <img
                    src={src}
                    alt={titles[i] || `Catégorie ${i + 1}`}
                    className="img-fluid rounded mb-2 category-img"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <div className="fw-bold small">{titles[i] || `Catégorie ${i + 1}`}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right btn" onClick={() => scroll(200)}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
