import React, { useState, useEffect } from 'react';
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

const ETH_USD_PRICE = 3000;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
// console.log("contract ", process.env.REACT_APP_CONTRACT_ADDRESS)

function usdToWei(usd) {
    const eth = usd / ETH_USD_PRICE;
    return ethers.parseEther(eth.toString());
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
        
        if (!walletAddress) {
            alert("Please connect your wallet first!");
            return;
        }

        if (!transactionManagementContract) {
            alert("Contract not initialized!");
            return;
        }

        try {
            setLoading(true);
            const value = usdToWei(calculateTotal());
            const tx = await transactionManagementContract.createTransaction(1, {
                value: value,
                gasLimit: 1000000
            });
            
            console.log("Transaction sent:", tx.hash);
            await tx.wait();
            setStep(3);
        } catch (error) {
            console.error("Transaction error:", error);
            alert(`Payment failed: ${error.shortMessage || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Cart calculation functions
    const cartItems = [
        { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1 },
        { id: 2, name: 'Smart Watch', price: 249.99, quantity: 1 },
    ];

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const shipping = 9.99;
        const tax = subtotal * 0.08;
        return subtotal + shipping + tax;
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
                            <Card className="mb-4">
                                <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                                    Shipping Information
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                        {/* Form fields remain the same */}
                                        <Button variant="dark" type="submit">Next</Button>
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