import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Table,
  Button, Spinner, Alert, Modal, Form
} from 'react-bootstrap';
import DashboardLayout from '../dashboard/DashboardLayout';
import { Eye, Pencil, Trash } from 'lucide-react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [orderData, setOrderData] = useState({
    created_at: '',
    id: '',
    items: [],
    total_price: '',
    status: '',
    user_email: ''
  });

  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [userRole, setUserRole] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (userRole === 'admin') {
        url = 'http://localhost:8001/orders';
      } else if (userRole === 'seller') {
        if (!sellerId) throw new Error('Seller ID is missing');
        url = `http://localhost:8001/orders/seller/${sellerId}`;
      } else {
        throw new Error('Invalid role');
      }

      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(`Failed to load orders: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [userRole, sellerId]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const id   = localStorage.getItem('user_id');
    setUserRole(role);
    setSellerId(id);
  }, []);

  useEffect(() => {
    if (userRole === 'admin' || (userRole === 'seller' && sellerId)) {
      fetchOrders();
    }
  }, [userRole, sellerId, fetchOrders]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsEditing(false);
    setOrderData(order);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsEditing(true);
    setOrderData(order);
    setShowModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/orders/${selectedOrder.id}`);
      setOrders(orders.filter(o => o.id !== selectedOrder.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete order.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8001/orders/${selectedOrder.id}`, orderData);
      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? { ...orderData } : o
      ));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update order.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Manage Orders
              </Card.Header>
              <Card.Body>

                <Row className="mb-3">
                  <Col md={6} className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Filter by User Email..."
                      value={nameFilter}
                      onChange={e => setNameFilter(e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Filter by Status..."
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    />
                  </Col>
                </Row>

                {loading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                      <tr>
                        <th>#</th>
                        <th>User Email</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(o =>
                          o.user_email?.toLowerCase().includes(nameFilter.toLowerCase()) &&
                          o.status?.toLowerCase().includes(statusFilter.toLowerCase())
                        )
                        .map((order, idx) => (
                          <tr key={order.id}>
                            <td>{idx + 1}</td>
                            <td>{order.user_email}</td>
                            <td>{order.status}</td>
                            <td>{order.total_price}</td>
                            <td className="text-center">
                              <Button
                                variant="link" size="sm"
                                onClick={() => handleView(order)}
                                style={{ color: 'black' }}
                              ><Eye size={18} /></Button>
                              <Button
                                variant="link" size="sm"
                                onClick={() => handleEdit(order)}
                                style={{ color: 'gold' }}
                              ><Pencil size={18} /></Button>
                              <Button
                                variant="link" size="sm"
                                onClick={() => handleDelete(order)}
                                style={{ color: 'red' }}
                              ><Trash size={18} /></Button>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Order' : 'Order Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={orderData.status}
                  onChange={e => setOrderData({ ...orderData, status: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="number"
                  value={orderData.total_price}
                  onChange={e => setOrderData({ ...orderData, total_price: e.target.value })}
                />
              </Form.Group>

              <Form.Label>Items</Form.Label>
              {orderData.items.map((item, i) => (
                <React.Fragment key={i}>
                  <Form.Group className="mb-2">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.product_name}
                      onChange={e => {
                        const items = [...orderData.items];
                        items[i].product_name = e.target.value;
                        setOrderData({ ...orderData, items });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={e => {
                        const items = [...orderData.items];
                        items[i].quantity = e.target.value;
                        setOrderData({ ...orderData, items });
                      }}
                    />
                  </Form.Group>
                </React.Fragment>
              ))}

              <Button variant="dark" type="submit">Update Order</Button>
            </Form>
          ) : (
            <div>
              <p><strong>User Email:</strong> {orderData.user_email}</p>
              <p><strong>Status:</strong> {orderData.status}</p>
              <p><strong>Total Price:</strong> {orderData.total_price}</p>
              <p><strong>Created at:</strong> {orderData.created_at}</p>
              <p><strong>Items:</strong></p>
              <ul>
  {orderData.items.map((it, i) => (
    <React.Fragment key={i}>
      <li>Product Name: {it.product_name}</li>
      <li>Quantity: {it.quantity}</li>
    </React.Fragment>
  ))}
</ul>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageOrders;
