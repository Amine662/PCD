import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import DashboardLayout from '../dashboard/DashboardLayout';
import { Eye, Pencil, Trash } from 'lucide-react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    role: ''
  });
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8001/manage-users');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/users/${selectedUser._id}`);
      setUsers(users.filter((user) => user._id !== selectedUser._id)); // Remove deleted user from the list
      setShowDeleteModal(false); // Close the delete modal
    } catch (err) {
      console.error(err);
      setError('Failed to delete user.');
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setUserData({ name: user.name, email: user.email, age: user.age, role: user.role });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setUserData({ name: user.name, email: user.email, age: user.age, role: user.role });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...userData };
      await axios.put(`http://localhost:8001/users/${selectedUser._id}`, updatedUser);
      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, ...updatedUser } : user)));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Manage Users
              </Card.Header>
              <Card.Body>

                {/* Filters */}
                <Row className="mb-3">
                  <Col md={6} className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Filter by name..."
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                    </Form.Select>
                  </Col>
                </Row>

                {/* Table */}
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="dark" />
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ width: '160px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user =>
                          user.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
                          (roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase())
                        )
                        .map((user, idx) => (
                          <tr key={user._id}>
                            <td>{idx + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className="text-center">
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleView(user)}
                                style={{ color: 'black' }}
                                className="action-icon"
                              >
                                <Eye size={18} />
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleEdit(user)}
                                style={{ color: 'gold' }}
                                className="action-icon"
                              >
                                <Pencil size={18} />
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                                style={{ color: 'red' }}
                                className="action-icon"
                              >
                                <Trash size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for Viewing/Editing User */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit User' : 'User Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  value={userData.age}
                  onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                />
              </Form.Group>

              <Button variant="dark" type="submit">
                Update User
              </Button>
            </Form>
          ) : (
            <div>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Age:</strong> {userData.age}</p>
              <p><strong>Role:</strong> {userData.role}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Small CSS for icon hover effect */}
      <style jsx="true">{`
        .action-icon:hover svg {
          transform: scale(1.3);
          transition: transform 0.2s;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ManageUsers;
