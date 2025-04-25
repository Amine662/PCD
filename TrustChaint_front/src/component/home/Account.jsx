import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import logo from './logo.png';
import './Account.css';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // user object with _id and password field optional

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8001/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser({ ...res.data.user, password: "" }); // Add password field for update
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const updatePayload = {
        name: user.name,
        email: user.email,
        age: user.age,
        address: user.address || "",
      };

      // Only include password if filled
      if (user.password && user.password.trim() !== "") {
        updatePayload.password = user.password;
      }

      await axios.put(
        `http://localhost:8001/auth/update/${user.user_id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Account updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

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


                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
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
