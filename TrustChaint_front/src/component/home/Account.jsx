import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import logo from './logo.png';
import './Account.css';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    address: '123 Main St, NY',
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Account updated!');
    }, 1500);
  };

  return (
    <div className="account-page-bg">
      <Container className="py-5">
        <div className="account-banner text-center text-white py-4 mb-4">
          <img
            src={logo}
            alt="Site Logo"
            onClick={() => navigate("/")}
            role="button"
            className="account-logo mb-3"
          />
          <h2 className="fw-bold">My Account</h2>
          <p>View and edit your personal details</p>
        </div>

        <Row className="justify-content-center g-4">
          {/* Display Current Info */}
          <Col lg={5}>
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Current Info
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Address:</strong> {user.address}</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Update Info Form */}
          <Col lg={7}>
            <Card>
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Update Info
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      value={user.age}
                      onChange={(e) => setUser({ ...user, age: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="dark" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Update Info'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Account;
