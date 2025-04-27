import React from 'react';

const StatCard = ({ iconClass, title, value, description }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body text-center">
        <div className="mb-3">
          <div className="bg-warning bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center p-3">
            <i className={`bi ${iconClass} text-warning`} style={{ fontSize: '1.75rem' }}></i>
          </div>
        </div>
        <h3 className="card-title h2">{value}</h3>
        <p className="text-muted mb-1">{title}</p>
        <p className="small text-muted">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
