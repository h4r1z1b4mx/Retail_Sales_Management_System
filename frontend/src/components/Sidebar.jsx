import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">V</div>
        <div className="sidebar-title">
          <h3>Vault</h3>
          <p>Harizibam</p>
        </div>
      </div>
      <ul className="nav-menu">
        <li className="nav-item active">
          <span className="nav-item-icon"></span>
          Dashboard
        </li>
    
      </ul>
    </div>
  );
};

export default Sidebar;
