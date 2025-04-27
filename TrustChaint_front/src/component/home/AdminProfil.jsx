import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import DashboardLayout from './dashboard/DashboardLayout';
import axios from 'axios';

const AdminProfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', age: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:8001/auth/auth/admin');
        console.log("Response Data:", res.data.user);

        if (res.data.user) {
          setUser({ ...res.data.user, password: '' });
        } else {
          setError('User data not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch admin data');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.put(`http://localhost:8001/auth/update/${user.user_id}`, user, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Update Success:', res.data);
      setSuccess('Profile updated successfully!');
      setUser(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (err) {
      console.error('Update Error:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col lg={7}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Update Info
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
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
    </DashboardLayout>
  );
};

export default AdminProfil;
