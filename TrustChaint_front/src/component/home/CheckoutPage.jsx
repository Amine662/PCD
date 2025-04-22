import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Spinner,
  ListGroup,
  InputGroup,
} from 'react-bootstrap';
import logo from './logo.png';
import './CheckoutPage.css';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvc: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const cartItems = [
    { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1 },
    { id: 2, name: 'Smart Watch', price: 249.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT20') {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="checkout-page-bg">
      <Container className="py-5">
        <div className="checkout-banner text-center text-white py-4 mb-4">
          <img src={logo} alt="Site Logo"  onClick={() => navigate("/")}  
                  role="button" className="checkout-logo mb-2" />
          <h2 className="fw-bold">Secure Checkout</h2>
          <p>Complete your order in just a few steps</p>
        </div>

        <Row>
          <Col lg={8}>
            {step === 1 && (
              <Card className="mb-4">
                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                  Shipping Information
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleShippingSubmit}>
                    <Form.Group controlId="firstName" className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      />
                    </Form.Group>
                    <Button variant="dark" type="submit">Next</Button>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {step === 2 && (
              <Card className="mb-4">
                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                  Payment Information
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handlePaymentSubmit}>
                    <Form.Group controlId="cardNumber" className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="cardholderName" className="mb-3">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="expiryDate" className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="cvc" className="mb-3">
                      <Form.Label>CVC</Form.Label>
                      <Form.Control
                        type="text"
                        value={paymentInfo.cvc}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                      />
                    </Form.Group>
                    <Button variant="dark" type="submit" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Submit Payment'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {step === 3 && (
              <Card className="mb-4">
                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                  Order Confirmation
                </Card.Header>
                <Card.Body>
                  <h4>Thank you for your purchase!</h4>
                  <p>Order Number: <strong>{`ORD-${Math.floor(100000 + Math.random() * 900000)}`}</strong></p>
                  <h5>Shipping Info</h5>
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.email}</p>
                  <h5>Order Summary</h5>
                  <ListGroup>
                    {cartItems.map((item) => (
                      <ListGroup.Item key={item.id}>
                        {item.name} x {item.quantity} - ${item.price.toFixed(2)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="mt-3">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Shipping: ${shipping.toFixed(2)}</p>
                    <p>Tax: ${tax.toFixed(2)}</p>
                    {promoApplied && <p>Discount: -${discount.toFixed(2)}</p>}
                    <hr />
                    <p><strong>Total: ${total.toFixed(2)}</strong></p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Order Summary
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item.id}>
                      {item.name} x {item.quantity} - ${item.price.toFixed(2)}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <hr />
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline-dark" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </InputGroup>
                <p><strong>Total: ${total.toFixed(2)}</strong></p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;
