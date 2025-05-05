import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Form,
    Spinner,
} from 'react-bootstrap';
import logo from './logo.png';
import './CheckoutPage.css';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import TransactionManagementJSON from "../TransactionManagement.json";

const ETH_USD_PRICE = 1817.82;

const CONTRACT_ADDRESS = process.env.REACT_APP_TRANSACTION_CONTRACT_ADDRESS;

function usdToWei(usd) {
    const eth = usd / ETH_USD_PRICE;
    const trimmedEth = eth.toFixed(18); // ensures it doesn't exceed 18 decimals
    return ethers.parseEther(trimmedEth);
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
    const [walletAddress, setWalletAddress] = useState("");
    const [transactionManagementContract, setTransactionManagementContract] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initializeProvider = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const network = await provider.getNetwork();
                    console.log("Connected to network:", network.name);

                    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
                        alert("Invalid contract address configuration");
                        return;
                    }

                    const contract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        TransactionManagementJSON.abi,
                        provider
                    );
                    setTransactionManagementContract(contract);

                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        handleWalletConnected(accounts[0].address, provider);
                    }
                } catch (error) {
                    console.error("Initialization error:", error);
                    alert("Failed to initialize Web3 provider");
                }
            }
        };

        initializeProvider();
    }, []);

    const handleWalletConnected = async (address, provider) => {
        try {
            const signer = await provider.getSigner();
            
            const contractWithSigner = new ethers.Contract(
                CONTRACT_ADDRESS,
                TransactionManagementJSON.abi,
                signer
            );
            
            setTransactionManagementContract(contractWithSigner);
            setWalletAddress(address);
            console.log("Wallet connected:", address);
        } catch (error) {
            console.error("Signer initialization error:", error);
            alert("Failed to initialize signer");
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            handleWalletConnected(accounts[0], provider);
        } catch (error) {
            console.error("Connection error:", error);
            alert("Wallet connection failed: " + error.message);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
      
        // 1. Pre-checks
        if (!walletAddress) {
          alert("Please connect your wallet first!");
          return;
        }
        if (!transactionManagementContract) {
          alert("Contract not initialized!");
          return;
        }
      
        setLoading(true);
        try {
          // 2. Load cart from localStorage
          const storedCart = JSON.parse(localStorage.getItem('finalcart'));
          if (!storedCart?.items?.length) {
            alert("Cart is empty or invalid.");
            return;
          }
      
          // 3. Build orderData
          const user_email = localStorage.getItem('user_email');
          const sellerId = storedCart.items[0].seller_id;
          const items = storedCart.items.map(item => ({
            product_name: item.product_details?.name || "Unnamed",
            quantity: item.quantity
          }));
          const total_price = calculateTotal().toFixed(2);
      
          const orderData = {
            user_email,
            items,
            sellerId,
            total_price,
            status: "Pending",
            created_at: new Date().toISOString()
          };
          console.log("Prepared orderData:", orderData);
      
          // 4. Send blockchain transaction
          const value = usdToWei(total_price);
          const tx = await transactionManagementContract.createTransaction(1, {
            value,
            gasLimit: 1_000_000
          });
          console.log("Transaction sent:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed");
      
          // 5. Post order to backend
          const response = await axios.post('http://localhost:8001/orders', orderData);
          console.log('Order created:', response.data);
          localStorage.setItem('current_order_id', response.data.id || response.data._id);
      
          // 6. Advance to confirmation step
          setStep(3);
      
        } catch (error) {
          console.error('Error during payment/order flow:', error.response?.data || error.message);
          alert(`Failed: ${error.response?.data?.detail ?? error.message}`);
        } finally {
          setLoading(false);
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
    

     const handleShippingSubmit = async (e) => {
       e.preventDefault();
       setStep(2);
    //     try {
    //         const storedCart = JSON.parse(localStorage.getItem('finalcart'));
    
    //         if (!storedCart || !storedCart.items || storedCart.items.length === 0) {
    //             alert("Cart is empty or invalid.");
    //             return;
    //         }
    
    //         const user_email = localStorage.getItem('user_email');
    //         const sellerId = storedCart.items[0].seller_id;
    
    //         const items = storedCart.items.map(item => ({
    //             product_name: item.product_details?.name || "Unnamed",
    //             quantity: item.quantity
    //         }));
    
    //         const total_price = calculateTotal();   
            
    
    //         const orderData = {
    //             user_email,
    //             items,
    //             sellerId,
    //             total_price,
    //             status: "Pending",
    //             created_at: new Date().toISOString()
    //         };
    
    //         console.log("Prepared orderData:", orderData); 
    
    //         const response = await axios.post('http://localhost:8001/orders', orderData);
    //         console.log('Order created:', response.data);
    
    //         localStorage.setItem('current_order_id', response.data.id || response.data._id);
    //         setStep(2);
    //     } catch (error) {
    //         console.error('Error creating order:', error.response?.data || error.message);
    //         alert('Failed to create order. Please try again.');
    //     }
};
    

    return (
        <div className="checkout-page-bg">
            <Container className="py-5">
                <div className="checkout-banner text-center text-white py-4 mb-4">
                    <img src={logo} alt="Site Logo" onClick={() => navigate("/")} role="button" className="checkout-logo mb-2" />
                    <h2 className="fw-bold">Secure Checkout</h2>
                    <p>Complete your order in just a few steps</p>
                    <div className="mb-3">
                        <Button variant="primary" onClick={connectWallet}>
                            {walletAddress
                                ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                                : "Connect Wallet"}
                        </Button>
                    </div>
                </div>
                
                <Row>
                    <Col lg={8}>
                        {/* Shipping Information Step */}
                        {step === 1 && (
                            <Card className="mb-4 ">
                                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                                    Shipping & Contact Information
                                </Card.Header>
                                <Card.Body>
                                <Form onSubmit={handleShippingSubmit}>
                                        {/* Contact Information */}
                                        <h5 className="mb-3">Contact Information</h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email*</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        required
                                                        value={shippingInfo.email}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            email: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone Number*</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        required
                                                        value={shippingInfo.phone}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            phone: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Shipping Address */}
                                        <h5 className="mb-3 mt-4">Shipping Address</h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name*</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        value={shippingInfo.firstName}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            firstName: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name*</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        value={shippingInfo.lastName}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            lastName: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Street Address*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={shippingInfo.address}
                                                onChange={(e) => setShippingInfo({
                                                    ...shippingInfo,
                                                    address: e.target.value
                                                })}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Apartment, suite, etc. (optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={shippingInfo.addressLine2}
                                                onChange={(e) => setShippingInfo({
                                                    ...shippingInfo,
                                                    addressLine2: e.target.value
                                                })}
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>City*</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        value={shippingInfo.city}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            city: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>State/Province*</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        value={shippingInfo.state}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            state: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>ZIP/Postal Code*</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        value={shippingInfo.zipCode}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            zipCode: e.target.value
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Country*</Form.Label>
                                                    <Form.Select
                                                        required
                                                        value={shippingInfo.country}
                                                        onChange={(e) => setShippingInfo({
                                                            ...shippingInfo,
                                                            country: e.target.value
                                                        })}
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="US">United States</option>
                                                        <option value="CA">Canada</option>
                                                        <option value="GB">United Kingdom</option>
                                                        {/* Add more countries as needed */}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Shipping Method */}
                                        <h5 className="mb-3 mt-4">Shipping Method</h5>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="radio"
                                                name="shippingMethod"
                                                id="standard"
                                                label="Standard Shipping (5-7 business days) - Free"
                                                defaultChecked
                                            />
                                            <Form.Check
                                                type="radio"
                                                name="shippingMethod"
                                                id="express"
                                                label="Express Shipping (2-3 business days) - $15.00"
                                            />
                                        </Form.Group>

                                        {/* Special Instructions */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Order Notes (Optional)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Special instructions for delivery"
                                                value={shippingInfo.notes}
                                                onChange={(e) => setShippingInfo({
                                                    ...shippingInfo,
                                                    notes: e.target.value
                                                })}
                                            />
                                        </Form.Group>

                                        <Button 
                                            variant="dark" 
                                            type="submit"
                                            className="mt-3"
                                        >
                                            Continue to Payment
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Payment Step */}
                        {step === 2 && (
                            <Card className="mb-4">
                                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                                    Payment Information
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handlePaymentSubmit}>
                                        <Button 
                                            variant="dark" 
                                            type="submit" 
                                            disabled={loading || !walletAddress}
                                        >
                                            {loading ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                `Pay $${calculateTotal().toFixed(2)}`
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Confirmation Step */}
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