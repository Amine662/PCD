import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import DashboardLayout from '../dashboard/DashboardLayout';
import { Eye, Pencil, Trash, CirclePlus } from 'lucide-react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [adminId, setAdminId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (userRole === 'admin') {
        console.log("Fetching products for admin...");
        url = 'http://localhost:8001/products';
      } else if (userRole === 'seller') {
        if (!sellerId) throw new Error('Seller ID is missing');
        console.log("Fetching products for seller...");
        url = `http://localhost:8001/products/seller/${sellerId}`;
      } else {
        throw new Error('Invalid role');
      }

      const res = await axios.get(url);
      console.log("Products fetched:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(`Failed to load products: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('user_id');
    const ad_id = localStorage.getItem('admin_id');
    console.log('Role:', role, 'SellerId:', id);
    console.log('Role:', role, 'AdminId:', ad_id);
    setUserRole(role);
    setSellerId(id);
    setAdminId(ad_id);

    // Set adminId if the role is admin
    if (role === 'admin') {
      setSellerId(ad_id);
    }
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      console.log('Triggering fetchProducts for admin');
      fetchProducts();
    } else if (userRole === 'seller' && sellerId) {
      console.log('Triggering fetchProducts for seller with sellerId:', sellerId);
      fetchProducts();
    } else if (userRole !== null) {
      setLoading(false);
      setError('Invalid role or missing seller ID.');
    }
  }, [userRole, sellerId]);

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
      category: product.category
    });
    setShowEditModal(true);
  };

  const handleDelete = (productId) => {
    setSelectedProduct(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/products/${selectedProduct}`);
      setProducts(products.filter((p) => p.id !== selectedProduct));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete product.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8001/products/${selectedProduct.id}`, productData);
      setProducts(products.map((p) => p.id === selectedProduct.id ? { ...p, ...productData } : p));
      setShowEditModal(false);
      setProductData({ name: '', quantity: '', price: '', description: '', category: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to update product.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      const imageData = new FormData();
      imageData.append('file', imageFile);
  
      // Step 1: Upload image to Cloudinary
      if (imageFile) {
        const cloudinaryRes = await axios.post(
          'http://localhost:8001/upload-image',
          imageData
        );
  
        imageUrl = cloudinaryRes.data.original_url;
      }
  
      // Step 2: Send product data + image URL to your backend
      const productPayload = {
        name: productData.name,
        quantity: productData.quantity,
        price: productData.price,
        description: productData.description,
        category: productData.category,
        sellerId: userRole === 'admin' ? adminId : sellerId,
        image_url: imageUrl,
      };
  
      const res = await axios.post('http://localhost:8001/products', productPayload);
  
      setProducts([...products, res.data]);
      setShowAddModal(false);
      setProductData({
        name: '',
        quantity: '',
        price: '',
        description: '',
        category: '',
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to add product.');
    }
  };
  

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
    setSelectedProduct(null);
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header style={{ backgroundColor: '#1a1a1a', color: 'gold' }}>
                Manage Products
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Filter by name..."
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="dark"
                      onClick={() => setShowAddModal(true)}
                      style={{ width: '50%', height: '100%', color: 'white' }}
                    >
                      <CirclePlus size={20} className="me-2" style={{ color: "white" }} />
                      Add Product
                    </Button>
                  </Col>
                </Row>
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
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(product => product.name.toLowerCase().includes(nameFilter.toLowerCase()))
                        .map((product, idx) => (
                          <tr key={product._id}>
                            <td>{idx + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td className="text-center">
                              <Button variant="link" size="sm" onClick={() => handleView(product)} style={{ color: 'black' }}>
                                <Eye size={18} />
                              </Button>
                              <Button variant="link" size="sm" onClick={() => handleEdit(product)} style={{ color: 'gold' }}>
                                <Pencil size={18} />
                              </Button>
                              <Button variant="link" size="sm" onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>
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

      {/* Modals for view, edit, add, and delete */}
      <Modal show={showViewModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>View Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <img 
                  src={selectedProduct.image_url} 
                  alt={selectedProduct.name} 
                  style={{ 
                    width: '50%', 
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }} />
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={productData.quantity} onChange={(e) => setProductData({ ...productData, quantity: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
            <Button type="submit" variant="success">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={productData.quantity} onChange={(e) => setProductData({ ...productData, quantity: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
            <Button type="submit" variant="primary">Add Product</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageProducts;