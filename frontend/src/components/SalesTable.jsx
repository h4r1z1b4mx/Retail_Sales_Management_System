import React from 'react';

const SalesTable = ({ sales, sortBy, sortOrder, onSortChange }) => {
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const formatCurrency = (amount) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
  };

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)', sortBy: 'date', sortOrder: 'desc' },
    { value: 'date-asc', label: 'Date (Oldest First)', sortBy: 'date', sortOrder: 'asc' },
    { value: 'quantity-desc', label: 'Quantity (High to Low)', sortBy: 'quantity', sortOrder: 'desc' },
    { value: 'quantity-asc', label: 'Quantity (Low to High)', sortBy: 'quantity', sortOrder: 'asc' },
    { value: 'customerName-asc', label: 'Customer Name (A-Z)', sortBy: 'customerName', sortOrder: 'asc' },
    { value: 'customerName-desc', label: 'Customer Name (Z-A)', sortBy: 'customerName', sortOrder: 'desc' }
  ];

  const currentSortValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>Transactions</h2>
        <div className="sort-control">
          <label className="sort-label">Sort by:</label>
          <select
            className="sort-select"
            value={currentSortValue}
            onChange={(e) => {
              const selected = sortOptions.find(opt => `${opt.sortBy}-${opt.sortOrder}` === e.target.value);
              onSortChange({ sortBy: selected.sortBy, sortOrder: selected.sortOrder });
            }}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer region</th>
              <th>Product ID</th>
              <th>Employee name</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="13" className="no-data">
                  No transactions found
                </td>
              </tr>
            ) : (
              sales.map((sale, index) => (
                <tr key={sale._id || index}>
                  <td>{sale.transactionId}</td>
                  <td>{formatDate(sale.date)}</td>
                  <td>{sale.customerId}</td>
                  <td>{sale.customerName}</td>
                  <td>
                    <span className="phone-copy">
                      {sale.phoneNumber}
                      <span
                        className="copy-icon"
                        onClick={() => handleCopyPhone(sale.phoneNumber)}
                        title="Copy phone number"
                      >
                        📋
                      </span>
                    </span>
                  </td>
                  <td>{sale.gender}</td>
                  <td>{sale.age}</td>
                  <td>{sale.productCategory}</td>
                  <td>{sale.quantity.toString().padStart(2, '0')}</td>
                  <td>{formatCurrency(sale.totalAmount)}</td>
                  <td>{sale.customerRegion}</td>
                  <td>{sale.productId}</td>
                  <td>{sale.employeeName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
