import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import DashboardLayout from '../dashboard/DashboardLayout';
import axios from 'axios';

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRole = localStorage.getItem('role');
      const userId = localStorage.getItem('user_id');
      let url = 'http://localhost:8001/transactions';
      if (userRole === 'seller' && userId) {
        url = `http://localhost:8001/transactions/receiver/${userId}`;
      } else if (userRole !== 'admin') {
        setError('Access denied. Admins and sellers only.');
        return;
      }
      const res = await axios.get(url);
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  console.log("Transactions Length:", transactions.length); 

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Manage Transactions
              </Card.Header>
              <Card.Body>
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
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Amount</th>
                        <th>Order ID</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((tx, idx) => {
                          console.log('Transaction:', tx);
                          return (
                            <tr key={tx._id}>
                              <td>{idx + 1}</td>
                              <td>{tx.sender || 'N/A'}</td>
                              <td>{tx.receiver || 'N/A'}</td>
                              <td>{tx.amount ? `$${tx.amount.toFixed(2)}` : 'N/A'}</td>
                              <td>{tx.order_id || 'N/A'}</td>
                              <td>
                                {tx.timestamp
                                  ? new Date(tx.timestamp).toLocaleString()
                                  : 'N/A'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No transactions available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default ManageTransactions;
