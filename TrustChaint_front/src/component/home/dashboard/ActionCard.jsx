import React from 'react';

const ActionCard = ({ iconClass, title, description, onClick }) => {
  return (
    <div
      className="card bg-warning text-dark shadow-sm h-100"
      role="button"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
        <div
          className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: '3rem', height: '3rem' }}
        >
          <i className={`bi ${iconClass}`} style={{ fontSize: '1.5rem' }}></i>
        </div>
        <h5 className="card-title">{title}</h5>
        <p className="card-text small">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
