import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { BsTrash } from 'react-icons/bs';


const Addtocart = () => {
  const { cartItems, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 10.0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const handleClearCart = () => {
    cartItems.forEach(item => removeFromCart(item.id));
  };

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
                  <h2 className="h5 fw-semibold mb-0">
                    Shopping Cart ({cartItems.length} items)
                  </h2>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearCart}
                  >
                    <i className="bi bi-trash me-2"></i>Clear
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-muted">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center py-3 border-bottom">
                      <button
  className="btn btn-outline-danger btn-sm me-3 d-flex align-items-center justify-content-center"
  onClick={() => removeFromCart(item.id)}
  style={{ width: '36px', height: '36px' }}
>
  <BsTrash size={18} />
</button>
                      <div className="flex-shrink-0 me-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-thumbnail"
                          style={{ width: '80px', height: '80px' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="mb-1 text-muted small">{item.category}</p>
                        <p className="mb-0 text-muted">${item.price}</p>
                      </div>
                      <div className="mx-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="text-end me-3" style={{ width: '100px' }}>
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))
                )}

                <div className="mt-4">
                  <Link to="/product" className="text-decoration-none text-primary">
                    <i className="bi bi-arrow-left me-2"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

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
                  <Link to="/login?redirect=checkout" className="btn btn-secondary" >
                    Sign In to Checkout
                  </Link>
                  <Link to="/product" className="btn btn-outline-secondary">
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-4 text-muted small">
                  <p className="mb-1">Secure Checkout with Blockchain</p>
                  <p>
                    We accept Ethereum and other major cryptocurrencies for secure, transparent,
                    and immutable transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addtocart;
