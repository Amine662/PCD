import React, { useState } from 'react';
import axios from 'axios'; 
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

const ETH_USD_PRICE = 3000; // 1 ETH = $3,000
function usdToWei(usd) {
    const eth = usd / ETH_USD_PRICE;
    return Math.round(eth * 1e18);
}

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
        ganachePrivateKey: '',
    });
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [loading, setLoading] = useState(false);


    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === 'DISCOUNT20') {
            setPromoApplied(true);
        } else {
            setPromoApplied(false);
        }
    };

    const calculateTotal = () => {
        const storedCart = JSON.parse(localStorage.getItem('finalcart'));
        if (!storedCart || !storedCart.items) return 0;
    
        const subtotal = storedCart.items.reduce((total, item) => {
            const price = item.product_details?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    
        const shipping = 0;
        const tax = subtotal * 0.07;
        return subtotal + shipping + tax;
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // 1. Load cart from localStorage
            const storedCart = JSON.parse(localStorage.getItem('finalcart'));
            if (!storedCart?.items?.length) {
                alert("Cart is empty or invalid.");
                setLoading(false);
                return;
            }
    
            // 2. Prepare orderData
            const user_email = localStorage.getItem('user_email');
            const sellerId = storedCart.items[0].seller_id;
            const items = storedCart.items.map(item => ({
                product_name: item.product_details?.name || "Unnamed",
                quantity: item.quantity
            }));
            const total_price = calculateTotal();
    
            const orderData = {
                user_email,
                items,
                sellerId,
                total_price,
                status: "Pending",
                created_at: new Date().toISOString()
            };
    
            console.log("Prepared orderData:", orderData);
    
            // 3. Post order to backend
            const orderResponse = await axios.post('http://localhost:8001/orders', orderData);
            console.log('Order created:', orderResponse.data);
            const orderId = orderResponse.data.id || orderResponse.data._id;
            localStorage.setItem('current_order_id', orderId);
    
            // 4. Perform blockchain transaction
            const productId = 1; // Example productId — consider dynamic mapping in the future
            const value = usdToWei(total_price); // Convert USD to Wei
    
            const blockchainResponse = await fetch('http://localhost:8001/blockchain/buy_product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    buyer_private_key: paymentInfo.ganachePrivateKey,
                    value: total_price
                })
            });
    
            const blockchainData = await blockchainResponse.json();
            if (!blockchainResponse.ok) {
                alert('Transaction failed! ' + (blockchainData.detail || ''));
                setLoading(false);
                return;
            }
    
            // 5. Advance to confirmation step
            setStep(3);
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