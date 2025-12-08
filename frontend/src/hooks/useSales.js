import { useState, useEffect, useCallback } from 'react';
import { getSales, getFilterOptions, getStatistics } from '../services/api';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const fetchSales = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const [salesResponse, statsResponse] = await Promise.all([
        getSales(currentFilters),
        getStatistics(currentFilters)
      ]);

      setSales(salesResponse.data);
      setPagination(salesResponse.pagination);
      setStatistics(statsResponse.data);
    } catch (err) {
      setError(err.message);
      setSales([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchSales(filters);
  }, [filters, fetchSales]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  }, []);

  return {
    sales,
    statistics,
    filterOptions,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters
  };
};
