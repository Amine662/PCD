import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellRing, 
  LogOut, 
  Menu, 
  X, 
} from 'lucide-react';
import logo from '../logo.png';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_id');
    navigate('/');
  };

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  const basePath = role === 'admin' ? '/admin' : role === 'seller' ? '/seller' : '';
  const navLinks = role === 'admin' ? [
    { path: `${basePath}/dashboard`, label: 'My Dashboard' },
    { path: `${basePath}/manage-users`, label: 'Users' },
    { path: `${basePath}/manage-products`, label: 'Products' },
    { path: `${basePath}/manage-orders`, label: 'Orders' },
    { path: `${basePath}/profile`, label: 'Profile' }
  ] : role === 'seller' ? [
    { path: `${basePath}-dashboard`, label: 'My Dashboard' },
    { path: `${basePath}/manage-products`, label: 'Products' },
    { path: `${basePath}/manage-orders`, label: 'Orders' }
  ] : [];

  return (
    <div className="min-vh-100 bg-light text-dark">
      <header className="d-flex justify-content-between align-items-center bg-dark text-white shadow-sm p-3">
        <button 
          className="d-lg-none btn btn-link text-white p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "10%", height: "auto", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <nav className="d-none d-lg-block">
          <ul className="nav">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <button 
                  onClick={() => navigate(link.path)} 
                  className={`nav-link ${link.label === 'My Dashboard' ? 'text-white' : 'text-warning'}`}
                >
                  <b>{link.label}</b>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <button className="btn btn-link text-white me-3 position-relative p-0">
            <BellRing size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              1
            </span>
          </button>

          <button className="btn btn-outline-warning btn-sm" onClick={handleLogout}>
            <LogOut size={20} className="me-2" />
            Logout
          </button>
        </div>
      </header>

      <div 
        className={`bg-dark text-white position-fixed top-0 start-0 h-100 ${mobileMenuOpen ? 'd-block' : 'd-none'} d-lg-none`} 
        style={{ width: 250, transition: 'all .3s ease', zIndex: 1000 }}
      >
        <div className="p-3">
          <button 
            className="btn btn-link text-white p-0 mb-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <ul className="nav flex-column">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <button 
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }} 
                  className={`nav-link ${link.label === 'My Dashboard' ? 'text-white' : 'text-warning'}`}
                >
                  <b>{link.label}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <main 
        className="container-fluid p-4" 
        style={{ marginLeft: mobileMenuOpen ? 250 : 0, transition: 'margin .3s ease' }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;