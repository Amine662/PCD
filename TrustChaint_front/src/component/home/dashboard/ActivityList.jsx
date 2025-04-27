import React from 'react';

const ActivityList = () => {
  const activities = [
    {
      id: 1,
      icon: 'person-plus',   // bi-person-plus
      color: 'success',      // green
      text: 'New user "JohnDoe" registered',
      time: '5 minutes ago',
    },
    {
      id: 2,
      icon: 'bag-check',     // bi-bag-check
      color: 'primary',      // blue
      text: 'Order #12345 completed',
      time: '32 minutes ago',
    },
    {
      id: 3,
      icon: 'phone',         // bi-phone
      color: 'secondary',    // grey
      text: 'Product "iPhone 15" updated',
      time: '1 hour ago',
    },
    {
      id: 4,
      icon: 'shop',          // bi-shop
      color: 'warning',      // amber
      text: 'Seller "TechWorld" verified',
      time: '2 hours ago',
    },
  ];

  return (
    <ul className="list-group list-group-flush">
      {activities.map(activity => (
        <li
          key={activity.id}
          className="list-group-item d-flex align-items-center"
        >
          <div
            className="me-3 bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '2rem', height: '2rem' }}
          >
            <i
              className={`bi bi-${activity.icon} text-${activity.color}`}
              style={{ fontSize: '1.25rem' }}
            ></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-1">{activity.text}</p>
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {activity.time}
            </small>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityList;
