import React from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Statistics from './components/Statistics';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import { useSales } from './hooks/useSales';
import './styles/App.css';

function App() {
  const {
    sales,
    statistics,
    filterOptions,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters
  } = useSales();

  const handleSearchChange = (search) => {
    updateFilters({ search });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleSortChange = (sortParams) => {
    updateFilters(sortParams);
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Sales Management System</h1>
        </div>

        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
        />

        <Filters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        <Statistics statistics={statistics} />

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading sales data...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        ) : (
          <>
            <SalesTable
              sales={sales}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={handleSortChange}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
