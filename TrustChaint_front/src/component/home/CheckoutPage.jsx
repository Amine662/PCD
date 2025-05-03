import React, { useState, useEffect } from 'react';
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
import { ethers } from 'ethers';

import TransactionManagementJSON from '../TransactionManagement.json';
const TransactionManagementABI = TransactionManagementJSON.abi;

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
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState(null);
    const [transactionManagementContract, setTransactionManagementContract] = useState(null);
    const [connected, setConnected] = useState(false);

    const transactionManagementAddress = "0x6AA79E6c5Fc18266619FD4Cc4a321b97E892E121";

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

    const connectWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(ethersProvider);
                const signer = await ethersProvider.getSigner();
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setWalletAddress(accounts[0]);
                setConnected(true);
                const contract = new ethers.Contract(
                    transactionManagementAddress,
                    TransactionManagementABI,
                    signer
                );
                setTransactionManagementContract(contract);
            } catch (err) {
                console.error("Wallet connection error:", err.message);
                alert("Failed to connect wallet. Please check MetaMask and try again.");
            }
        } else {
            alert("MetaMask is not installed. Please install MetaMask to use this feature.");
        }
    };

    const getCurrentWalletConnected = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(ethersProvider);
                const signer = await ethersProvider.getSigner();
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setConnected(true);
                    const contract = new ethers.Contract(
                        transactionManagementAddress,
                        TransactionManagementABI,
                        signer
                    );
                    setTransactionManagementContract(contract);
                }
            } catch (err) {
                console.error("Error fetching connected account:", err.message);
            }
        }
    };

    const addWalletListener = () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setConnected(true);
                    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(ethersProvider);
                    const signer = await ethersProvider.getSigner();
                    const contract = new ethers.Contract(
                        transactionManagementAddress,
                        TransactionManagementABI,
                        signer
                    );
                    setTransactionManagementContract(contract);
                } else {
                    setWalletAddress('');
                    setConnected(false);
                    setTransactionManagementContract(null);
                }
            });
        } else {
            setWalletAddress('');
            setConnected(false);
            console.log("MetaMask is not installed. Please Install.");
        }
    };

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
    }, []);

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!transactionManagementContract) {
            alert("Please connect your wallet to proceed with the blockchain transaction.");
            setLoading(false);
            return;
        }

        try {
            const productId = 1;
            const amount = total;

            const tx = await transactionManagementContract.createTransaction(productId, {
                value: ethers.parseEther(amount.toString()),
                gasLimit: 1000000,
            });

            const receipt = await tx.wait();
            console.log("Transaction successful!", receipt);
            setStep(3);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed! " + error.message);
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

                {!connected && (
                    <div className="text-center mb-4">
                        <Button variant="primary" onClick={connectWallet}>
                            Connect Wallet
                        </Button>
                        <p className="mt-2 text-muted">Connect your MetaMask wallet to continue.</p>
                    </div>
                )}

                {connected && (
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
                )}
            </Container>
        </div>
    );
};

export default CheckoutPage;
