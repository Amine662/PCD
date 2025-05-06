import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import StatCard from './dashboard/StatCard';
import ActionCard from './dashboard/ActionCard';
import SalesChart from './dashboard/SalesChart';
import ActivityList from './dashboard/ActivityList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user");
  const cardStyle = {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.375rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };
  const hoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
  };

  return (
    <DashboardLayout>
      <div className="text-center mb-4">
        <h1 className="h3 fw-bold mb-2">
          Welcome {userName} <span className="d-none d-sm-inline">👋</span>
        </h1>
        <p className="text-muted">Here's what's happening with your store today</p>
      </div>
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-people"
            title="Active Users"
            value="1,245"
            description="7.4% increase from last month"
            style={cardStyle}
            className="shadow-lg rounded-3"
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-box-seam"
            title="Products"
            value="321"
            description="12 new products this week"
            style={cardStyle}
            className="shadow-lg rounded-3"
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-cart"
            title="Orders"
            value="598"
            description="32 orders today"
            style={cardStyle}
            className="shadow-lg rounded-3"
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-currency-dollar"
            title="Revenue"
            value="$45,320"
            description="23.5% increase from last month"
            style={cardStyle}
            className="shadow-lg rounded-3"
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>
      </div>
      
      <h2 className="h5 fw-bold mb-3">Quick Actions</h2>
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-person-plus"
            title="Manage Users"
            description="View, edit or delete users"
            onClick={() => navigate('/admin/manage-users')}
            style={cardStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-box"
            title="Manage Products"
            description="Add, edit or remove products"
            onClick={() => navigate('/admin/manage-products')}
            style={cardStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard 
            iconClass="bi-truck" 
            title="Manage Orders"
            description="Track and update orders"
            onClick={() => navigate('/admin/manage-orders')}
            style={cardStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-shop"
            title="Manage Sellers"
            description="Approve or block sellers"
            onClick={() => navigate('/admin/manage-sellers')}
            style={cardStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          />
        </div>
      </div>
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-8">
          <div className="card h-100 shadow-lg rounded-3" style={cardStyle}>
            <div className="card-header d-flex align-items-center">
              <i className="bi-bar-chart-fill text-warning me-2"></i>
              <h5 className="mb-0">Sales Overview</h5>
            </div>
            <div className="card-body">
              <SalesChart />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 shadow-lg rounded-3" style={cardStyle}>
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <ActivityList />
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-5 shadow-lg rounded-3" style={cardStyle}>
        <div className="card-body">
          <h5 className="mb-4 fw-bold">Performance Metrics</h5>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Conversion Rate</small>
                <small className="text-success fw-bold">4.7%</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-success" style={{ width: '47%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Avg. Order Value</small>
                <small className="text-primary fw-bold">$85.20</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-primary" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Return Rate</small>
                <small className="text-warning fw-bold">2.3%</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-warning" style={{ width: '23%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Customer Satisfaction</small>
                <small className="text-purple fw-bold">4.8/5</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-purple" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminDashboard;

