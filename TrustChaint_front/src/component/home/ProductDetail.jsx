import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';
import { MdLocalShipping } from "react-icons/md";
import { FaShieldAlt, FaBoxOpen } from "react-icons/fa";
import axios from 'axios';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/api/products/${id}`);
        setProduct(res.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(String(product.id), quantity, product.seller_id);
    axios.post('http://localhost:8001/cart', {
      user_id: localStorage.getItem('user_id'),
      items: [{
        product_id: product.id,
      quantity,
      seller_id: product.seller_id,
      }]
    }).then(r=>alert("product added")).catch(err=>console.log(err))
    
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/addtocart');
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {product ? (
          <div className="row">
            <div className="col-md-6 text-center">
              <img src={product.image} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '350px', objectFit: 'cover' }} />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold">{product.name}</h2>
              <p className="text-muted text-capitalize">{product.category}</p>
              <h2 style={{ color: '#1a1a1a' }}>${product.price}</h2>
              <p>{product.description}</p>

              <div className="d-flex align-items-center my-3" style={{ maxWidth: '200px' }}>
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <input
                  type="number"
                  className="form-control text-center mx-2"
                  value={quantity}
                  min="1"
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>

              <button className="btn btn-dark btn-lg me-3" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn btn-dark btn-lg" onClick={handleBuyNow}>Buy it now</button>

              <div className="mt-4">
                <div className="d-flex align-items-center text-secondary mb-3">
                  <MdLocalShipping color='#1a1a1a' size={30} className="me-3" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="d-flex align-items-center text-secondary mb-3">
                  <FaShieldAlt color='#1a1a1a' size={30} className="me-3" />
                  <span>Secure blockchain payment</span>
                </div>
                <div className="d-flex align-items-center text-secondary mb-3">
                  <FaBoxOpen color='#1a1a1a' size={30} className="me-3" />
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
      <Footer />
    </>
  );
};

export default ProductDetail;