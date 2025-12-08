import React from 'react';

const Statistics = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <div className="statistics-section">
      <div className="stat-card">
        <div className="stat-header">
          <span>ℹ️</span>
          <span>Total units sold</span>
        </div>
        <div className="stat-value">{statistics.totalUnitsSold}</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>ℹ️</span>
          <span>Total Amount</span>
        </div>
        <div className="stat-value">₹{statistics.totalAmount.toLocaleString()}</div>
        <div className="stat-subtext">
          ({statistics.totalTransactions} SR{statistics.totalTransactions !== 1 ? 's' : ''})
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>ℹ️</span>
          <span>Total Discount</span>
        </div>
        <div className="stat-value">₹{statistics.totalDiscount.toLocaleString()}</div>
        <div className="stat-subtext">
          ({statistics.totalTransactions} SR{statistics.totalTransactions !== 1 ? 's' : ''})
        </div>
      </div>
    </div>
  );
};

export default Statistics;
