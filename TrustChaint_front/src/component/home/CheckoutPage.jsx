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
        ganachePrivateKey: '',
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

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productId = 1; // Example productId
            const value = Math.round(total * 1e18); // Convert ETH to Wei (assuming 1 ETH = 1e18 Wei)
            const response = await fetch('http://localhost:8001/blockchain/buy_product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    buyer_private_key: paymentInfo.ganachePrivateKey,
                    value: value
                })
            });
            const data = await response.json();
            if (response.ok) {
                setStep(3);
            } else {
                alert('Transaction failed! ' + (data.detail || ''));
            }
        } catch (error) {
            alert('Transaction failed! ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="checkout-page-bg">
            <Container className="py-5">
                <div className="checkout-banner text-center text-white py-4 mb-4">
                    <img src={logo} alt="Site Logo" onClick={() => navigate("/")} role="button" className="checkout-logo mb-2" />
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
                                        <Form.Group controlId="ganachePrivateKey" className="mb-3">
                                            <Form.Label>Ganache Private Key</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={paymentInfo.ganachePrivateKey}
                                                onChange={(e) => setPaymentInfo({ ...paymentInfo, ganachePrivateKey: e.target.value })}
                                                placeholder="Paste your Ganache private key here"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                This is only for local testing. Never use a real wallet key here!
                                            </Form.Text>
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
                                    Confirmation
                                </Card.Header>
                                <Card.Body>
                                    <h4>Thank you for your purchase!</h4>
                                    <p>Your transaction has been successfully processed on the blockchain.</p>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CheckoutPage;