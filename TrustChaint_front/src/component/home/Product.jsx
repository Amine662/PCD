import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import Footer from './Footer';
import Navbar from './Navbar';
import { PlusCircle } from 'lucide-react';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8001/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-light py-5">
        <div className="container">
          <h1 className="display-4 font-weight-bold text-dark mb-4">All Products</h1>
          <div className="d-flex flex-column flex-md-row gap-4">
            <div className="flex-grow-1">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {products.map(product => (
                  <div className="col" key={product._id}>
                    <div className="card shadow rounded-4 border-0 h-100 product-card hover-shadow">
                      <div className="position-relative" style={{ paddingBottom: '100%' }}>
                        <img
                          src={product.image_url || "https://via.placeholder.com/300"}
                          alt={product.name}
                          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover cursor-pointer"
                          onClick={() => handleProductClick(product.id)}
                          style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                        />
                      </div>
                      <div className="p-3 d-flex flex-column justify-content-between" style={{ minHeight: '150px' }}>
                        <div>
                          <h5 className="fw-semibold text-dark mb-1">{product.name}</h5>
                          <p className="text-muted small mb-2">{product.description?.slice(0, 50) || 'Great quality product.'}</p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 text-dark mb-0">${product.price}</span>
                          <button
                            className="btn p-0 border-0 text-warning"
                            onClick={() => handleProductClick(product._id)}
                            title="View Product"
                          >
                            <PlusCircle size={24} strokeWidth={2.2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-muted">No products available.</div>
                )}
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
