import React from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from './dashboard/DashboardLayout';
import StatCard from './dashboard/StatCard';
import ActionCard from './dashboard/ActionCard';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user");

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="text-center mb-4">
        <h1 className="h3 fw-bold mb-2">
          Welcome {userName} <span className="d-none d-sm-inline">👋</span>
        </h1>
        <p className="text-muted">Here's what's happening with your store today</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-box-seam"
            title="Products"
            value="321"
            description="12 new products this week"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-cart"
            title="Orders"
            value="598"
            description="32 orders today"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            iconClass="bi-currency-dollar"
            title="Revenue"
            value="$45,320"
            description="23.5% increase from last month"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="h5 fw-bold mb-3 text-center">Quick Actions</h2>
      <div className="row g-4 mb-5 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-box"
            title="Manage Products"
            description="Add, edit or remove products"
            onClick={() => navigate('/seller/manage-products')}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-truck"
            title="Manage Orders"
            description="Track and update orders"
            onClick={() => navigate('/seller/manage-orders')}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <ActionCard
            iconClass="bi-bar-chart-fill"
            title="View Sales"
            description="Track your sales and performance"
            onClick={() => navigate('/seller/sales')}
          />
        </div>
      </div>

      {/* Store Performance Summary */}
      <div className="card mb-5">
        <div className="card-body">
          <h5 className="mb-4 fw-bold text-center">Store Performance Summary</h5>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Total Products Sold</small>
                <small className="fw-bold">4,125</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Average Shipping Time</small>
                <small className="fw-bold">2.3 days</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-primary" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Total Returns</small>
                <small className="fw-bold">45</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-warning" style={{ width: '10%' }}></div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Customer Satisfaction</small>
                <small className="fw-bold">4.8/5</small>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-info" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default SellerDashboard;
