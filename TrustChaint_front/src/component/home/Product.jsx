import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import Footer from './Footer';
import Navbar from './Navbar';

const Product = () => {
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);  // Navigate to product details page
  };

  return (
    <div><Navbar />
    <div className="bg-light py-5">
      <div className="container">
        <h1 className="display-4 font-weight-bold text-dark mb-4">All Products</h1>
        <div className="d-flex flex-column flex-md-row gap-4">
          <div className="flex-grow-1">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {[...Array(12)].map((_, index) => {
                const productId = index + 1; // Simulating unique product IDs

                return (
                  <div className="col" key={productId}>
                    <div className="card shadow-sm rounded-lg overflow-hidden">
                      <div className="position-relative" style={{ paddingBottom: '100%' }}>
                        <img
                          src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                          alt="Product"
                          className="position-absolute inset-0 w-100 h-100 object-cover object-center"
                          onClick={() => handleProductClick(productId)} // On click, navigate to product detail
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="h5 font-weight-medium text-dark mb-1">{`Product ${productId}`}</h3>
                        <div className="d-flex justify-content-between">
                          <span className="h4 font-weight-semibold text-dark">$299.99</span>
                          <button
                            className="btn btn-primary rounded-circle p-1"
                            onClick={() => handleProductClick(productId)} // Navigate to product detail
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
                              <circle cx="8" cy="21" r="1"></circle>
                              <circle cx="19" cy="21" r="1"></circle>
                              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Product;
