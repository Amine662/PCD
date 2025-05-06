import React, { useState, useEffect } from "react";
import { CiCreditCard1 } from "react-icons/ci";
import { FaEuroSign } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
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

const Slide = () => {
  const navigate = useNavigate();
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const { addToCart } = useCart();

  const bannerImages = [
    {
      id: 1,
      src: "https://www.cdiscount.com/other/alerte-discount-slider-pc-1620x410-pdm-2025-2-18-tos4024862129187_250219102112.png?1922ba1a-26f5-47fb-8e59-0630b6089260",
      alt: "TV Discount"
    },
    {
      id: 2,
      src: "https://www.cdiscount.com/other/slider-pc-2025-1620x347-pdt-p19-96643_250417172755.png?934f1139-90dd-414a-9096-bedc1cbbd2ab",
      alt: "ZLAN"
    },
    {
      id: 3,
      src: "https://www.cdiscount.com/other/slider-pc-2025-1620x347-switch-2-p19_250411120146.jpg?c354e616-c546-43be-981d-00cd4047a286",
      alt: "Nintendo Switch 2"
    },
    {
        id: 4,
        src: "https://www.cdiscount.com/other/alerte-discount-slider-pc-1620x410-pdm-2025-2-18-tos4024862129187_250219102112.png?1922ba1a-26f5-47fb-8e59-0630b6089260",
        alt: "TV Discount"
      },
      {
        id: 5,
        src: "https://www.cdiscount.com/other/slider-pc-2025-1620x347-pdt-p19-96643_250417172755.png?934f1139-90dd-414a-9096-bedc1cbbd2ab",
        alt: "ZLAN"
      },
      {
        id: 6,
        src: "https://www.cdiscount.com/other/slider-pc-2025-1620x347-switch-2-p19_250411120146.jpg?c354e616-c546-43be-981d-00cd4047a286",
        alt: "Nintendo Switch 2"
      }
  ];
  
  const productSlides = [
    [
      { 
        id: 1, 
        image: a1, 
        title: "Apple MacBook Air 13-Inch Laptop with M4 Chip",
        price: "$1054.99",
        discount: "15%"
      },
      { 
        id: 2, 
        image: a2, 
        title: "Apple iPad with A16 Bionic Chip and Liquid Retina Display",
        price: "$392.99",
        discount: "10%"
      },
      { 
        id: 3, 
        image: a3, 
        title: "THOMSON 32'' (80 cm) HD - LED Fire TV Smart TV",
        price: "$169.99",
        discount: "20%"
      },
      { 
        id: 4, 
        image: a4, 
        title: "Tristar Deep Fryer, 3L Capacity, 2000W, Cool Zone Technology, Stainless Steel",
        price: "$34.99",
        discount: "5%"
      }
    ],
    [
      { 
        id: 5, 
        image: a5, 
        title: "SONY DualSense Black & White Bluetooth/USB Gaming Controller for PlayStation 5",
        price: "$98.99",
        discount: "30%"
      },
      { 
        id: 6, 
        image: a6, 
        title: "Comfee' RCD93BL2EURT(E) Under-Counter Refrigerator, 93L, Retro Freestanding Fridge",
        price: "$144.99",
        discount: "12%"
      },
      { 
        id: 7, 
        image: a7, 
        title: "Philips 32PFS6109 Smart LED HD TV - 32 Inches",
        price: "$159.99",
        discount: "8%"
      },
      { 
        id: 8, 
        image: a8, 
        title: "FurnitureR Morandi - 1 Upholstered Kitchen Chair",
        price: "$37.99",
        discount: "25%"
      }
    ],
    [
      { 
        id: 9, 
        image: a9, 
        title: "45W Fast USB-C Charger for iPhone 16 15/Pro/Pro Max",
        price: "$11.99",
        discount: "18%"
      },
      { 
        id: 10, 
        image: a10, 
        title: "Apple iPhone 13 Pro Max, 128GB, Gold - (Refurbished)",
        price: "$539.99",
        discount: "22%"
      },
      { 
        id: 11, 
        image: a11, 
        title: "Belkin BoostCharge 3-in-1 Magnetic & Foldable Qi2 Charging Stand",
        price: "$99.99",
        discount: "7%"
      },
      { 
        id: 12, 
        image: a12, 
        title: "AEG Lavamat Washing Machine L69670VFL FL/A +++/171 kWh/year/1600 RPM, 7kg",
        price: "$324.99",
        discount: "35%"
      }
    ]
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProductSlide((prevSlide) => 
        prevSlide === productSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); 
    
    return () => clearInterval(timer);
  }, [productSlides.length]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerSlide((prevSlide) => 
        prevSlide === bannerImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000);
    
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const prevProductSlide = () => {
    setCurrentProductSlide((prevSlide) => 
      prevSlide === 0 ? productSlides.length - 1 : prevSlide - 1
    );
  };

  const nextProductSlide = () => {
    setCurrentProductSlide((prevSlide) => 
      prevSlide === productSlides.length - 1 ? 0 : prevSlide + 1
    );
  };
  
  const prevBannerSlide = () => {
    setCurrentBannerSlide((prevSlide) => 
      prevSlide === 0 ? bannerImages.length - 1 : prevSlide - 1
    );
  };

  const nextBannerSlide = () => {
    setCurrentBannerSlide((prevSlide) => 
      prevSlide === bannerImages.length - 1 ? 0 : prevSlide + 1
    );
  };
  
  const goToBannerSlide = (index) => {
    setCurrentBannerSlide(index);
  };

  return (
    <div className="bg-light py-4">
      <div className="container">

        <div className="position-relative mb-4">
          <div className="carousel-container overflow-hidden rounded">
            <div 
              className="carousel-slides d-flex transition-transform" 
              style={{ 
                transform: `translateX(-${currentBannerSlide * 100}%)`,
                transition: "transform 0.5s ease-in-out"
              }}
            >
              {bannerImages.map((image) => (
                <div 
                  key={image.id} 
                  className="w-100 flex-shrink-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="img-fluid w-100"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle p-2 ms-2 shadow" 
            onClick={prevBannerSlide}
            aria-label="Previous banner"
          >
            <span className="fw-bold">&lsaquo;</span>
          </button>
          
          <button 
            className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle p-2 me-2 shadow" 
            onClick={nextBannerSlide}
            aria-label="Next banner"
          >
            <span className="fw-bold">&rsaquo;</span>
          </button>
        
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
            <div className="d-flex gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator-dot btn p-0 border-0 rounded-circle ${currentBannerSlide === index ? 'bg-primary' : 'bg-white'}`}
                  style={{ width: '12px', height: '12px' }}
                  onClick={() => goToBannerSlide(index)}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4 text-center">
          <div className="col-12 col-sm-6 col-lg-3">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
              onClick={() => navigate("/contact")}
            >
              <CiCreditCard1 size={24} />
              Paiement en 4x
            </button>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
              onClick={() => navigate("/contact")}
            >
              <FaEuroSign size={18} />
              Prix bas toute l'année
            </button>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
              onClick={() => navigate("/contact")}
            >
              <CiStar size={24} />
              E-commerce engagé
            </button>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
              onClick={() => navigate("/contact")}
            >
              <TbTruckDelivery size={24} />
              Livraison sur mesure
            </button>
          </div>
        </div>

        <div className="position-relative mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-3 fw-normal mb-0">Inspired by your visits</h2>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={prevProductSlide}
                aria-label="Previous product slide"
              >
                &#10094;
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={nextProductSlide}
                aria-label="Next product slide"
              >
                &#10095;
              </button>
            </div>
          </div>

          <div className="carousel-container overflow-hidden">
            <div 
              className="carousel-slides d-flex transition-transform" 
              style={{ 
                transform: `translateX(-${currentProductSlide * 100}%)`,
                transition: "transform 0.5s ease-in-out"
              }}
            >
              {productSlides.map((slideGroup, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="w-100 flex-shrink-0"
                >
                  <div className="row g-4">
                    {slideGroup.map((product) => (
                      <div key={product.id} className="col-12 col-md-6 col-lg-3">
                        <div className="border rounded bg-white p-3 h-100 shadow-sm product-box">
                          <div className="position-relative mb-2">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="img-fluid mx-auto d-block"
                              style={{ maxHeight: "160px" }}
                            />
                            <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded-start">
                              -{product.discount}
                            </div>
                          </div>
                          <h5 className="fs-6 mb-1">{product.title}</h5>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="fw-bold text-danger">{product.price}</div>
                            <button className="btn btn-sm text-white" style={{ backgroundColor: "#1a1a1a" }} onClick={addToCart}> Add To Cart </button>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="carousel-indicators d-flex justify-content-center gap-2 mt-3">
            {productSlides.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator-dot btn p-0 border-0 rounded-circle ${currentProductSlide === index ? 'bg-primary' : 'bg-secondary'}`}
                style={{ width: '10px', height: '10px' }}
                onClick={() => setCurrentProductSlide(index)}
                aria-label={`Go to product slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;