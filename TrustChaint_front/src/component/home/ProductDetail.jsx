import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';
import dummyProducts from './dummyProducts';
import { MdLocalShipping } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const found = dummyProducts.find((p) => String(p.id) === String(id));
    setProduct(found || null);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/addtocart');
    }
  };

  // Get similar products (just taking first 4 others for demo)
  const similarProducts = dummyProducts
    .filter((p) => String(p.id) !== String(id))
    .slice(0, 4);

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        {product ? (
          <div className="row">
            <div className="col-md-6 text-center">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold">{product.name}</h2>
              <p className="text-muted text-capitalize">{product.category}</p>
              <h2 style={{ color: '#1a1a1a' }}>${product.price}</h2>

              <p>{product.description}</p>

              <div className="d-flex align-items-center my-3" style={{ maxWidth: '200px' }}>
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  className="form-control text-center mx-2"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="btn btn-dark btn-lg me-3" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn btn-dark btn-lg" onClick={handleBuyNow}>
                Buy it now
              </button>

              {/* ✅ Benefits Section */}
              <div className="mt-4 space-y-4">
                <div className="d-flex align-items-center text-secondary mb-3"><MdLocalShipping  color='#1a1a1a' size={30}/>
                  <i className="bi bi-truck me-3 text-primary"></i>
                  <span>Free shipping on orders over $50</span>
                </div>

                <div className="d-flex align-items-center text-secondary mb-3"><FaShieldAlt color='#1a1a1a' size={30}/>
                  <i className="bi bi-shield-lock me-3 text-primary"></i>
                  <span>Secure blockchain payment</span>
                </div>

                <div className="d-flex align-items-center text-secondary mb-3"><FaBoxOpen  color='#1a1a1a' size={30}/>
                  <i className="bi bi-arrow-counterclockwise me-3 text-primary"></i>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <h4>Product not found.</h4>
          </div>
        )}
      </div>

      {/* ✅ Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="container pb-5">
          <h3 className="mb-4 fw-bold">You might also like</h3>
          <div className="row">
            {similarProducts.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{item.name}</h6>
                      <h4 style={{ color: '#1a1a1a' }}>${item.price}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
