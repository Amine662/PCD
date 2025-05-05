import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { BsTrash } from 'react-icons/bs';
import axios from 'axios';

const Addtocart = () => {
  const { removeFromCart, clearCart } = useCart();
  const [cartDetails, setCartDetails] = useState({ items: [] });

  useEffect(() => {
    axios
      .get('http://localhost:8001/cart/' + localStorage.getItem('user_id'))
      .then((r) => {
        setCartDetails(r.data);
        localStorage.setItem('finalcart', JSON.stringify(r.data));
      })
      .catch((err) => console.log(err));
  }, []);

  // Order summary calculations
  const subtotal = cartDetails.items.reduce(
    (sum, item) => sum + item.product_details.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.0 : 0;
  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div>
      <Navbar />
      <div className="bg-light py-5 min-vh-100">
        <div className="container">
          <h1 className="mb-4 fw-bold text-dark">Your Cart</h1>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                  <h2 className="h5 fw-semibold mb-0">Shopping Cart</h2>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      clearCart();
                      setCartDetails({ items: [] });
                    }}
                  >
                    <BsTrash size={18} className="me-2" /> Clear
                  </button>
                </div>

                {cartDetails.items.length === 0 ? (
                  <p className="text-muted">Your cart is empty.</p>
                ) : (
                  cartDetails.items.map((item) => (
                    <div key={item.product_id} className="d-flex align-items-center py-3 border-bottom">
                      <button
                        className="btn btn-outline-danger btn-sm me-3 d-flex align-items-center justify-content-center"
                        onClick={() => {
                          removeFromCart(item.product_id);
                          setCartDetails((prev) => ({
                            ...prev,
                            items: prev.items.filter((i) => i.product_id !== item.product_id),
                          }));
                        }}
                        style={{ width: '36px', height: '36px' }}
                      >
                        <BsTrash size={18} />
                      </button>

                      <div className="flex-shrink-0 me-3">
                        <img
                          src={item.product_details.image_url}
                          className="img-thumbnail"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          alt={item.product_details.name}
                        />
                      </div>

                      <div className="flex-grow-1">
                        <h5 className="mb-1">{item.product_details.name}</h5>
                        <p className="mb-1 text-muted small">{item.product_details.category}</p>
                        <p className="mb-0 text-muted">${item.product_details.price}</p>
                      </div>

                      <div className="mx-3">
                        <span>{item.quantity}</span>
                      </div>

                      <div className="text-end me-3" style={{ width: '100px' }}>
                        <strong>${(item.product_details.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))
                )}

                <div className="mt-4">
                  <Link to="/product" className="text-decoration-none text-primary">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* ✅ Order Summary */}
            <div className="col-lg-4">
              <div className="bg-white rounded p-4 shadow-sm sticky-top" style={{ top: '100px' }}>
                <h2 className="h5 fw-bold mb-3">Order Summary</h2>
                <ul className="list-unstyled mb-3">
                  <li className="d-flex justify-content-between text-muted mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-muted mb-2">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-muted mb-2">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </li>
                </ul>
                <div className="border-top pt-3 mb-3">
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Link to="/login?redirect=check" className="btn btn-secondary">
                    Sign In to Checkout
                  </Link>
                  <Link to="/product" className="btn btn-outline-secondary">
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-4 text-muted small">
                  <p className="mb-1">Secure Checkout with Blockchain</p>
                  <p>We accept Ethereum and other major cryptocurrencies for secure, transparent, and immutable transactions.</p>
                </div>
              </div>
            </div>
            {/* ✅ End Order Summary */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addtocart;
