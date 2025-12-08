import React from 'react';
import MultiSelect from './MultiSelect';

const Filters = ({ filters, filterOptions, onFilterChange, onReset }) => {
  if (!filterOptions) return null;

  return (
    <div className="search-filter-section">
      <div className="filters-container">
        <MultiSelect
          label="Customer Region"
          options={filterOptions.customerRegions}
          value={filters.customerRegion}
          onChange={(value) => onFilterChange({ customerRegion: value })}
          placeholder="All Regions"
        />

        <MultiSelect
          label="Gender"
          options={filterOptions.genders}
          value={filters.gender}
          onChange={(value) => onFilterChange({ gender: value })}
          placeholder="All Genders"
        />

        <div className="filter-group">
          <label className="filter-label">Age Range</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              value={filters.ageMin}
              onChange={(e) => onFilterChange({ ageMin: e.target.value })}
              min={filterOptions.ageRange.minAge}
              max={filterOptions.ageRange.maxAge}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              value={filters.ageMax}
              onChange={(e) => onFilterChange({ ageMax: e.target.value })}
              min={filterOptions.ageRange.minAge}
              max={filterOptions.ageRange.maxAge}
            />
          </div>
        </div>

        <MultiSelect
          label="Product Category"
          options={filterOptions.productCategories}
          value={filters.productCategory}
          onChange={(value) => onFilterChange({ productCategory: value })}
          placeholder="All Categories"
        />

        <MultiSelect
          label="Tags"
          options={filterOptions.tags}
          value={filters.tags}
          onChange={(value) => onFilterChange({ tags: value })}
          placeholder="All Tags"
        />

        <MultiSelect
          label="Payment Method"
          options={filterOptions.paymentMethods}
          value={filters.paymentMethod}
          onChange={(value) => onFilterChange({ paymentMethod: value })}
          placeholder="All Methods"
        />

        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="date"
              className="filter-input"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
            />
            <input
              type="date"
              className="filter-input"
              value={filters.dateTo}
              onChange={(e) => onFilterChange({ dateTo: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-reset" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
