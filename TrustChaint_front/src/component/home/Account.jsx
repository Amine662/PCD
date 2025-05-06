import React, { useState, useEffect } from 'react';
import {Container,Row,Col,Card,Form,Button,Spinner}from 'react-bootstrap';
import axios from 'axios';
import logo from './logo.png';
import './Account.css';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get('http://localhost:8001/auth/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...res.data.user, password: '' });
      } catch (err) {
        console.error('Fetch error:', err);
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const payload = {
        name: user.name,
        email: user.email,
        age: user.age,
        address: user.address || '',
        ...(user.password?.trim() && { password: user.password }),
      };

      await axios.put(
        `http://localhost:8001/auth/update/${user.user_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Account updated!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update account.');
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
        <div className="account-banner text-center text-white py-4 mb-5" style={{ backgroundColor: '#1a1a1a' }}>
          <img
            src={logo}
            alt="Logo"
            role="button"
            onClick={() => navigate('/')}
            className="account-logo mb-3"
            style={{ cursor: 'pointer', width: '100px' }}
          />
          <h2 className="fw-bold">My Account</h2>
          <p>View and edit your personal details</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={5}>
            <Card className="mb-4 shadow">
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

          <Col lg={7}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Update Info
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      value={user.age}
                      onChange={(e) => setUser({ ...user, age: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
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
